import { signupSchema } from "@dd-chat/validators"
import { Hono } from "hono"

const app = new Hono()

app.post("/signup", async (c) => {
	const body = await c.req.json()
	const parsed = signupSchema.parse(body)
	return c.json({ response: "ok", received: parsed }, 201)
})

export default app
