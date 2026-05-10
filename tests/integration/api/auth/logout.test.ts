import { prisma } from "@dd-chat/db"
import { app } from "../../../helpers/app"
import { loginAndGetCookie } from "../../../helpers/auth"

describe("POST /logout", () => {
	test("with valid cookie returns 204, deletes the session and clears the cookie", async () => {
		const { user, cookie } = await loginAndGetCookie()

		const response = await app.request("/auth/logout", {
			method: "POST",
			headers: { Cookie: cookie },
		})

		expect(response.status).toBe(204)

		const setCookie = response.headers.get("set-cookie")
		expect(setCookie).not.toBeNull()
		expect(setCookie).toMatch(/^session=/)
		expect(setCookie).toContain("Max-Age=0")
		expect(setCookie).toContain("HttpOnly")
		expect(setCookie).toContain("SameSite=Lax")
		expect(setCookie).toContain("Path=/")

		const sessions = await prisma.session.findMany({ where: { userId: user.id } })
		expect(sessions).toHaveLength(0)
	})

	test("without cookie returns 204 (idempotent) and does not touch the database", async () => {
		const { user } = await loginAndGetCookie()
		const before = await prisma.session.count()

		const response = await app.request("/auth/logout", { method: "POST" })

		expect(response.status).toBe(204)

		const after = await prisma.session.count()
		expect(after).toBe(before)

		const stillThere = await prisma.session.findMany({ where: { userId: user.id } })
		expect(stillThere).toHaveLength(1)
	})

	test("cookie reused after logout no longer authenticates", async () => {
		const { cookie } = await loginAndGetCookie()

		await app.request("/auth/logout", {
			method: "POST",
			headers: { Cookie: cookie },
		})

		const meResponse = await app.request("/auth/me", {
			headers: { Cookie: cookie },
		})

		expect(meResponse.status).toBe(401)
	})
})
