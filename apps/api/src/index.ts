import { ZodError } from "zod"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import auth from "./routes/auth.js"
import { AuthenticationError } from "./errors.js"
import { ContentfulStatusCode } from "hono/utils/http-status"

const app = new Hono()

app.onError((err, c) => {
	console.error(err)

	if (err instanceof ZodError) {
		return c.json({ error: err.message, issues: err.issues }, 400)
	}

  if (err instanceof AuthenticationError) {
    return c.json({ error: err.message, code: err.code }, err.statusCode)
  }

	if (err instanceof HTTPException) {
		return err.getResponse()
	}

	return c.json({ error: "Internal server error" }, 500)
})

app.route("/auth", auth)

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`)
	},
)
