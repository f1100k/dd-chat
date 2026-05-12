import crypto from "node:crypto"
import { prisma } from "@dd-chat/db"
import type { GoogleIdTokenPayload } from "@dd-chat/validators"
import type { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { AuthenticationError } from "../errors.js"
import { publicUserSelect } from "./service.js"

const OAUTH_STATE_COOKIE = "oauth_state"
const OAUTH_STATE_TTL_SECONDS = 10 * 60

const USERNAME_MIN = 3
const USERNAME_MAX = 30
const USERNAME_SUFFIX_BUDGET = 5

export function generateState(): string {
	return crypto.randomBytes(24).toString("hex")
}

export function setStateCookie(c: Context, state: string) {
	setCookie(c, OAUTH_STATE_COOKIE, state, {
		maxAge: OAUTH_STATE_TTL_SECONDS,
		httpOnly: true,
		sameSite: "Lax",
		path: "/",
	})
}

export function getStateCookie(c: Context): string | undefined {
	return getCookie(c, OAUTH_STATE_COOKIE)
}

export function clearStateCookie(c: Context) {
	deleteCookie(c, OAUTH_STATE_COOKIE, {
		path: "/",
		sameSite: "Lax",
		httpOnly: true,
	})
}

function slugifyEmail(email: string): string {
	const localPart = email.split("@")[0] ?? ""
	return localPart
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "")
}

async function generateUniqueUsername(email: string): Promise<string> {
	const slug = slugifyEmail(email)
	const baseFromEmail = slug.slice(0, USERNAME_MAX - USERNAME_SUFFIX_BUDGET)
	const base =
		baseFromEmail.length >= USERNAME_MIN
			? baseFromEmail
			: `user${crypto.randomBytes(3).toString("hex")}`

	let candidate = base
	for (let attempts = 0; attempts < 8; attempts++) {
		const exists = await prisma.user.findUnique({
			where: { username: candidate },
			select: { id: true },
		})
		if (!exists) return candidate
		candidate = `${base}-${crypto.randomBytes(2).toString("hex")}`
	}
	throw new Error("Could not generate a unique username after 8 attempts")
}

export async function findOrCreateGoogleUser(payload: GoogleIdTokenPayload) {
	const existing = await prisma.account.findUnique({
		where: {
			provider_providerAccountId: {
				provider: "google",
				providerAccountId: payload.sub,
			},
		},
		select: { user: { select: publicUserSelect } },
	})
	if (existing) return existing.user

	if (!payload.email_verified) {
		throw new AuthenticationError("Google email not verified")
	}

	const userByEmail = await prisma.user.findUnique({
		where: { email: payload.email },
		select: { id: true },
	})

	if (userByEmail) {
		await prisma.account.create({
			data: {
				provider: "google",
				providerAccountId: payload.sub,
				userId: userByEmail.id,
			},
		})
		return prisma.user.findUniqueOrThrow({
			where: { id: userByEmail.id },
			select: publicUserSelect,
		})
	}

	const username = await generateUniqueUsername(payload.email)
	return prisma.user.create({
		data: {
			email: payload.email,
			username,
			displayName: payload.name ?? username,
			accounts: {
				create: {
					provider: "google",
					providerAccountId: payload.sub,
				},
			},
		},
		select: publicUserSelect,
	})
}
