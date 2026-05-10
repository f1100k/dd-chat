import { signupSchema, loginSchema } from "@dd-chat/validators"
import { Hono } from "hono"
import { signupUser, loginUser } from "./service.js"
import { setSessionCookie } from "./session.js"

const app = new Hono()

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

export default app
