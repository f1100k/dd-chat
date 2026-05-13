import { exchangeCodeForTokens, verifyIdToken } from "@dd-chat/api/auth/google"
import { prisma } from "@dd-chat/db"
import type { GoogleIdTokenPayload, GoogleTokenResponse } from "@dd-chat/validators"
import { faker } from "@faker-js/faker"
import { vi } from "vitest"
import { app } from "../../../helpers/app"
import { createUser } from "../../../helpers/factories/user"

vi.mock("@dd-chat/api/auth/google", () => ({
	buildAuthUrl: vi.fn(
		(state: string) =>
			`https://accounts.google.com/o/oauth2/v2/auth?client_id=test-client-id&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=openid+email+profile&access_type=offline&prompt=select_account&state=${state}`,
	),
	exchangeCodeForTokens: vi.fn(),
	verifyIdToken: vi.fn(),
}))

const buildPayload = (overrides: Partial<GoogleIdTokenPayload> = {}): GoogleIdTokenPayload => ({
	iss: "https://accounts.google.com",
	sub: faker.string.numeric(21),
	aud: "test-client-id",
	exp: Math.floor(Date.now() / 1000) + 3600,
	iat: Math.floor(Date.now() / 1000),
	email: faker.internet.email().toLowerCase(),
	email_verified: true,
	name: faker.person.fullName(),
	picture: "https://example.com/avatar.png",
	...overrides,
})

const buildTokens = (idToken = "fake-id-token"): GoogleTokenResponse => ({
	access_token: "fake-access-token",
	id_token: idToken,
	expires_in: 3600,
	token_type: "Bearer",
	scope: "openid email profile",
})

beforeEach(() => {
	vi.mocked(exchangeCodeForTokens).mockReset()
	vi.mocked(verifyIdToken).mockReset()
})

describe("GET /auth/google", () => {
	test("redirects to Google with a state param and sets a matching oauth_state cookie", async () => {
		const response = await app.request("/auth/google", { redirect: "manual" })

		expect(response.status).toBe(302)

		const location = response.headers.get("location")
		expect(location).not.toBeNull()
		expect(location).toMatch(/^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth/)

		const params = new URL(location as string).searchParams
		expect(params.get("response_type")).toBe("code")
		expect(params.get("scope")).toContain("openid")
		expect(params.get("scope")).toContain("email")
		expect(params.get("scope")).toContain("profile")

		const stateInUrl = params.get("state")
		expect(stateInUrl).toBeTruthy()

		const setCookie = response.headers.get("set-cookie")
		expect(setCookie).not.toBeNull()
		expect(setCookie).toMatch(/^oauth_state=/)
		expect(setCookie).toContain("HttpOnly")
		expect(setCookie).toContain("SameSite=Lax")
		expect(setCookie).toContain("Path=/")

		const cookieState = (setCookie as string).match(/oauth_state=([^;]+)/)?.[1]
		expect(stateInUrl).toBe(cookieState)
	})
})

describe("GET /auth/google/callback", () => {
	describe("error paths", () => {
		test("without state cookie returns 400", async () => {
			const response = await app.request("/auth/google/callback?code=abc&state=xyz", {
				redirect: "manual",
			})
			expect(response.status).toBe(400)
		})

		test("with mismatched state returns 400", async () => {
			const response = await app.request("/auth/google/callback?code=abc&state=other", {
				headers: { Cookie: "oauth_state=expected" },
				redirect: "manual",
			})
			expect(response.status).toBe(400)
		})

		test("with provider error param returns 400 and does not call token exchange", async () => {
			const response = await app.request("/auth/google/callback?error=access_denied&state=s", {
				headers: { Cookie: "oauth_state=s" },
				redirect: "manual",
			})
			expect(response.status).toBe(400)
			expect(vi.mocked(exchangeCodeForTokens)).not.toHaveBeenCalled()
		})

		test("with email_verified=false rejects and creates no user", async () => {
			vi.mocked(exchangeCodeForTokens).mockResolvedValue(buildTokens())
			vi.mocked(verifyIdToken).mockResolvedValue(buildPayload({ email_verified: false }))

			const response = await app.request("/auth/google/callback?code=valid&state=s", {
				headers: { Cookie: "oauth_state=s" },
				redirect: "manual",
			})

			expect(response.status).toBe(401)
			expect(await prisma.user.count()).toBe(0)
			expect(await prisma.account.count()).toBe(0)
			expect(await prisma.session.count()).toBe(0)
		})

		test("clears the oauth_state cookie even on failure", async () => {
			const response = await app.request("/auth/google/callback?code=abc&state=other", {
				headers: { Cookie: "oauth_state=expected" },
				redirect: "manual",
			})

			const setCookie = response.headers.get("set-cookie") ?? ""
			expect(setCookie).toContain("oauth_state=")
			expect(setCookie).toContain("Max-Age=0")
		})
	})

	describe("happy paths", () => {
		test("creates a new user, an Account row and a Session on first sign-in", async () => {
			const payload = buildPayload({ email: "newuser@example.com", name: "New User" })

			vi.mocked(exchangeCodeForTokens).mockResolvedValue(buildTokens())
			vi.mocked(verifyIdToken).mockResolvedValue(payload)

			const response = await app.request("/auth/google/callback?code=valid&state=s", {
				headers: { Cookie: "oauth_state=s" },
				redirect: "manual",
			})

			expect(response.status).toBe(302)
			expect(response.headers.get("location")).toBe(process.env.OAUTH_POST_LOGIN_REDIRECT ?? "/")

			const setCookie = response.headers.get("set-cookie") ?? ""
			expect(setCookie).toMatch(/session=/)
			expect(setCookie).toContain("HttpOnly")
			expect(setCookie).toContain("SameSite=Lax")

			const user = await prisma.user.findUniqueOrThrow({
				where: { email: payload.email },
				include: { accounts: true, sessions: true },
			})

			expect(user.passwordHash).toBeNull()
			expect(user.displayName).toBe(payload.name)
			expect(user.accounts).toHaveLength(1)
			expect(user.accounts[0]?.provider).toBe("google")
			expect(user.accounts[0]?.providerAccountId).toBe(payload.sub)
			expect(user.sessions).toHaveLength(1)
		})

		test("auto-links Google to an existing email-based user (no duplicate user)", async () => {
			const { user } = await createUser({ email: "linkme@example.com" })
			const payload = buildPayload({ email: "linkme@example.com", sub: "google-sub-link" })

			vi.mocked(exchangeCodeForTokens).mockResolvedValue(buildTokens())
			vi.mocked(verifyIdToken).mockResolvedValue(payload)

			const response = await app.request("/auth/google/callback?code=valid&state=s", {
				headers: { Cookie: "oauth_state=s" },
				redirect: "manual",
			})

			expect(response.status).toBe(302)
			expect(await prisma.user.count()).toBe(1)

			const account = await prisma.account.findUniqueOrThrow({
				where: {
					provider_providerAccountId: {
						provider: "google",
						providerAccountId: "google-sub-link",
					},
				},
			})
			expect(account.userId).toBe(user.id)

			const sessions = await prisma.session.findMany({ where: { userId: user.id } })
			expect(sessions).toHaveLength(1)
		})

		test("reuses the linked user when the same Google account signs in again", async () => {
			const { user } = await createUser({ email: "returning@example.com" })
			await prisma.account.create({
				data: {
					provider: "google",
					providerAccountId: "google-sub-returning",
					userId: user.id,
				},
			})
			const payload = buildPayload({
				email: "returning@example.com",
				sub: "google-sub-returning",
			})

			vi.mocked(exchangeCodeForTokens).mockResolvedValue(buildTokens())
			vi.mocked(verifyIdToken).mockResolvedValue(payload)

			const response = await app.request("/auth/google/callback?code=valid&state=s", {
				headers: { Cookie: "oauth_state=s" },
				redirect: "manual",
			})

			expect(response.status).toBe(302)
			expect(await prisma.user.count()).toBe(1)
			expect(await prisma.account.count()).toBe(1)

			const sessions = await prisma.session.findMany({ where: { userId: user.id } })
			expect(sessions).toHaveLength(1)
		})

		test("derives username from the email local part for new users", async () => {
			const payload = buildPayload({ email: "jane.doe@example.com" })

			vi.mocked(exchangeCodeForTokens).mockResolvedValue(buildTokens())
			vi.mocked(verifyIdToken).mockResolvedValue(payload)

			await app.request("/auth/google/callback?code=valid&state=s", {
				headers: { Cookie: "oauth_state=s" },
				redirect: "manual",
			})

			const created = await prisma.user.findUniqueOrThrow({
				where: { email: "jane.doe@example.com" },
			})
			expect(created.username).toMatch(/^jane-doe(-[a-f0-9]{4})?$/)
		})
	})
})
