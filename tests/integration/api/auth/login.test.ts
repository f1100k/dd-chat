import { prisma } from "@dd-chat/db"
import { userPublicSchema } from "@dd-chat/validators"
import { app } from "../../../helpers/app"
import { createUser } from "../../../helpers/factories/user"
import type { ApiError, ZodErrorResponse } from "../../../helpers/types"

describe("POST /login", () => {
	test("with valid credentials returns 200, UserPublic body and Set-Cookie", async () => {
		const { user, password } = await createUser()

		const response = await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier: user.email, password }),
		})

		expect(response.status).toBe(200)

		const parsed = userPublicSchema.strict().parse(await response.json())
		expect(parsed.id).toBe(user.id)
		expect(parsed.email).toBe(user.email)
		expect(parsed.username).toBe(user.username)
		expect(parsed.displayName).toBe(user.displayName)

		const setCookie = response.headers.get("set-cookie")
		expect(setCookie).not.toBeNull()
		expect(setCookie).toMatch(/^session=/)
		expect(setCookie).toContain("HttpOnly")
		expect(setCookie).toContain("SameSite=Lax")
		expect(setCookie).toContain("Path=/")
		expect(setCookie).toMatch(/Max-Age=\d+/)
	})

	test("with username as identifier returns 200", async () => {
		const { user, password } = await createUser()

		const response = await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier: user.username, password }),
		})

		expect(response.status).toBe(200)

		const parsed = userPublicSchema.strict().parse(await response.json())
		expect(parsed.id).toBe(user.id)
	})

	test("with empty body should return 400", async () => {
		const response = await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({}),
		})

		const responseBody = (await response.json()) as ZodErrorResponse

		expect(response.status).toBe(400)
		expect(responseBody.issues.length).toBe(2)
	})

	test("with non-existent identifier should return 401 generic", async () => {
		const response = await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier: "ghost@nope.com", password: "whatever123" }),
		})

		expect(response.status).toBe(401)

		const responseBody = (await response.json()) as ApiError
		expect(responseBody).toEqual({
			code: "AUTHENTICATION_FAILED",
			error: "Invalid credentials",
		})
	})

	test("with wrong password returns the same generic 401", async () => {
		const { user } = await createUser()

		const response = await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier: user.email, password: "definitely-wrong-password" }),
		})

		expect(response.status).toBe(401)

		const responseBody = (await response.json()) as ApiError
		expect(responseBody).toEqual({
			code: "AUTHENTICATION_FAILED",
			error: "Invalid credentials",
		})
	})

	test("persists a Session row linked to the user", async () => {
		const { user, password } = await createUser()

		await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier: user.email, password }),
		})

		const sessions = await prisma.session.findMany({ where: { userId: user.id } })
		expect(sessions).toHaveLength(1)
	})

	test("cookie token matches the persisted session token", async () => {
		const { user, password } = await createUser()

		const response = await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier: user.email, password }),
		})

		const setCookie = response.headers.get("set-cookie")
		if (!setCookie) throw new Error("expected set-cookie header")
		const cookieToken = setCookie.match(/^session=([^;]+)/)?.[1]

		const session = await prisma.session.findFirstOrThrow({ where: { userId: user.id } })
		expect(cookieToken).toBe(session.token)
	})

	test("session expiresAt is in the future and aligns with cookie Max-Age", async () => {
		const { user, password } = await createUser()
		const beforeMs = Date.now()

		const response = await app.request("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ identifier: user.email, password }),
		})

		const session = await prisma.session.findFirstOrThrow({ where: { userId: user.id } })
		const dbTtlMs = session.expiresAt.getTime() - beforeMs
		expect(dbTtlMs).toBeGreaterThan(6 * 24 * 60 * 60 * 1000)
		expect(dbTtlMs).toBeLessThan(8 * 24 * 60 * 60 * 1000)

		const setCookie = response.headers.get("set-cookie")
		if (!setCookie) throw new Error("expected set-cookie header")
		const maxAge = Number(setCookie.match(/Max-Age=(\d+)/)?.[1])
		expect(maxAge).toBeGreaterThan(6 * 24 * 60 * 60)
		expect(maxAge).toBeLessThan(8 * 24 * 60 * 60)
	})
})
