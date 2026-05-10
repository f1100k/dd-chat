import { prisma } from "@dd-chat/db"
import { userPublicSchema } from "@dd-chat/validators"
import { app } from "../../../helpers/app"
import { loginAndGetCookie } from "../../../helpers/auth"
import { createUser } from "../../../helpers/factories/user"
import type { ApiError } from "../../../helpers/types"

describe("GET /me", () => {
	test("without cookie returns 401 generic", async () => {
		const response = await app.request("/auth/me")

		expect(response.status).toBe(401)

		const body = (await response.json()) as ApiError
		expect(body).toEqual({
			code: "AUTHENTICATION_FAILED",
			error: "Unauthenticated",
		})
	})

	test("with unknown session token returns 401", async () => {
		const response = await app.request("/auth/me", {
			headers: { Cookie: "session=deadbeefdeadbeef" },
		})

		expect(response.status).toBe(401)
	})

	test("with expired session returns 401", async () => {
		const { user } = await createUser()

		await prisma.session.create({
			data: {
				token: "expired-token",
				userId: user.id,
				expiresAt: new Date(Date.now() - 1000),
			},
		})

		const response = await app.request("/auth/me", {
			headers: { Cookie: "session=expired-token" },
		})

		expect(response.status).toBe(401)
	})

	test("with valid cookie returns 200 and the public user", async () => {
		const { user, cookie } = await loginAndGetCookie()

		const response = await app.request("/auth/me", {
			headers: { Cookie: cookie },
		})

		expect(response.status).toBe(200)

		const parsed = userPublicSchema.strict().parse(await response.json())
		expect(parsed.id).toBe(user.id)
		expect(parsed.email).toBe(user.email)
		expect(parsed.username).toBe(user.username)
		expect(parsed.displayName).toBe(user.displayName)
	})
})
