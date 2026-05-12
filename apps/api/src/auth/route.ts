import { loginSchema, signupSchema } from "@dd-chat/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getCookie } from "hono/cookie"
import { type AuthEnv, authMiddleware } from "./middleware.js"
import { loginUser, signupUser } from "./service.js"
import { clearSessionCookie, revokeSession, setSessionCookie } from "./session.js"

const app = new Hono<AuthEnv>()

const throwOnInvalid = (result: { success: boolean; error?: unknown }) => {
	if (!result.success) {
		throw result.error
	}
}

app.post("/signup", zValidator("json", signupSchema, throwOnInvalid), async (c) => {
	const user = await signupUser(c.req.valid("json"))
	return c.json(user, 201)
})

app.post("/login", zValidator("json", loginSchema, throwOnInvalid), async (c) => {
	const { user, session } = await loginUser(c.req.valid("json"))
	setSessionCookie(c, session)
	return c.json(user, 200)
})

app.get("/me", authMiddleware, (c) => {
	return c.json(c.get("user"), 200)
})

app.post("/logout", async (c) => {
	const token = getCookie(c, "session")

	if (token) {
		await revokeSession(token)
	}

	clearSessionCookie(c)

	return c.body(null, 204)
})

export default app
