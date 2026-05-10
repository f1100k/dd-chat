import { signupSchema, loginSchema } from "@dd-chat/validators"
import { Hono } from "hono"
import { getCookie } from "hono/cookie"
import { authMiddleware, type AuthEnv } from "./middleware.js"
import { signupUser, loginUser } from "./service.js"
import { clearSessionCookie, revokeSession, setSessionCookie } from "./session.js"

const app = new Hono<AuthEnv>()

app.post("/signup", async (c) => {
	const body = await c.req.json()
	const parsed = signupSchema.parse(body)
	const user = await signupUser(parsed)
	return c.json(user, 201)
})

app.post("/login", async (c) => {
	const body = await c.req.json()
	const parsed = loginSchema.parse(body)
	const { user, session } = await loginUser(parsed)

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
