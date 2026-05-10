import { ZodError } from "zod"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import auth from "./auth/route.js"
import { AppError } from "./errors.js"

const app = new Hono()

app.onError((err, c) => {
	if (err instanceof ZodError) {
		return c.json({ error: err.message, issues: err.issues }, 400)
	}

  if (err instanceof AppError) {
    return c.json({ error: err.message, code: err.code }, err.statusCode)
  }

	if (err instanceof HTTPException) {
		return err.getResponse()
	}

	console.error(err)

	return c.json({ error: "Internal server error" }, 500)
})

app.route("/auth", auth)

export default app
