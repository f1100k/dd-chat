import crypto from "node:crypto"
import {
	type GoogleIdTokenPayload,
	type GoogleTokenResponse,
	googleIdTokenPayloadSchema,
	googleTokenResponseSchema,
} from "@dd-chat/validators"

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs"
const GOOGLE_ISSUERS = new Set(["https://accounts.google.com", "accounts.google.com"])
const SCOPES = ["openid", "email", "profile"] as const
const CLOCK_SKEW_SECONDS = 60
const JWKS_FALLBACK_TTL_MS = 60 * 60 * 1000

function requireEnv(name: string): string {
	const value = process.env[name]
	if (!value) {
		throw new Error(`Missing required env var: ${name}`)
	}
	return value
}

export function buildAuthUrl(state: string): string {
	const url = new URL(GOOGLE_AUTH_URL)
	url.searchParams.set("client_id", requireEnv("GOOGLE_CLIENT_ID"))
	url.searchParams.set("redirect_uri", requireEnv("GOOGLE_REDIRECT_URI"))
	url.searchParams.set("response_type", "code")
	url.searchParams.set("scope", SCOPES.join(" "))
	url.searchParams.set("state", state)
	url.searchParams.set("access_type", "offline")
	url.searchParams.set("prompt", "select_account")
	return url.toString()
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: requireEnv("GOOGLE_CLIENT_ID"),
			client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
			redirect_uri: requireEnv("GOOGLE_REDIRECT_URI"),
			grant_type: "authorization_code",
		}),
	})

	if (!response.ok) {
		const text = await response.text()
		throw new Error(`Google token exchange failed: ${response.status} ${text}`)
	}

	return googleTokenResponseSchema.parse(await response.json())
}

type GoogleJwk = { kid: string; kty: string; alg?: string; use?: string; n: string; e: string }
type JwksCache = { keys: Map<string, GoogleJwk>; expiresAt: number }

let jwksCache: JwksCache | null = null

async function fetchJwks(): Promise<JwksCache> {
	const response = await fetch(GOOGLE_JWKS_URL)
	if (!response.ok) {
		throw new Error(`Failed to fetch JWKS: ${response.status}`)
	}

	const data = (await response.json()) as { keys: GoogleJwk[] }
	const maxAgeMatch = response.headers.get("cache-control")?.match(/max-age=(\d+)/)
	const ttlMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : JWKS_FALLBACK_TTL_MS

	return {
		keys: new Map(data.keys.map((key) => [key.kid, key])),
		expiresAt: Date.now() + ttlMs,
	}
}

async function getSigningKey(kid: string): Promise<GoogleJwk> {
	if (!jwksCache || jwksCache.expiresAt <= Date.now()) {
		jwksCache = await fetchJwks()
	}

	let key = jwksCache.keys.get(kid)
	if (!key) {
		jwksCache = await fetchJwks()
		key = jwksCache.keys.get(kid)
	}

	if (!key) {
		throw new Error(`Unknown JWT key id: ${kid}`)
	}
	return key
}

function base64UrlDecode(input: string): Buffer {
	const padding = (4 - (input.length % 4)) % 4
	const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padding)
	return Buffer.from(padded, "base64")
}

export async function verifyIdToken(idToken: string): Promise<GoogleIdTokenPayload> {
	const parts = idToken.split(".")
	if (parts.length !== 3) {
		throw new Error("Invalid JWT: expected 3 segments")
	}
	const [headerB64, payloadB64, signatureB64] = parts as [string, string, string]

	const header = JSON.parse(base64UrlDecode(headerB64).toString("utf8")) as {
		alg?: string
		kid?: string
	}
	if (header.alg !== "RS256") {
		throw new Error(`Unsupported JWT alg: ${header.alg}`)
	}
	if (!header.kid) {
		throw new Error("Missing kid in JWT header")
	}

	const jwk = await getSigningKey(header.kid)
	const publicKey = crypto.createPublicKey({ key: jwk as crypto.JsonWebKey, format: "jwk" })
	const signedInput = Buffer.from(`${headerB64}.${payloadB64}`, "utf8")
	const signature = base64UrlDecode(signatureB64)

	if (!crypto.verify("RSA-SHA256", signedInput, publicKey, signature)) {
		throw new Error("Invalid JWT signature")
	}

	const payload = googleIdTokenPayloadSchema.parse(
		JSON.parse(base64UrlDecode(payloadB64).toString("utf8")),
	)

	const nowSeconds = Math.floor(Date.now() / 1000)
	if (payload.exp + CLOCK_SKEW_SECONDS < nowSeconds) {
		throw new Error("JWT expired")
	}
	if (payload.iat - CLOCK_SKEW_SECONDS > nowSeconds) {
		throw new Error("JWT iat is in the future")
	}
	if (!GOOGLE_ISSUERS.has(payload.iss)) {
		throw new Error(`Invalid iss: ${payload.iss}`)
	}
	if (payload.aud !== requireEnv("GOOGLE_CLIENT_ID")) {
		throw new Error("Invalid aud")
	}

	return payload
}
