import { APICallError, RetryError } from "ai"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { ZodError } from "zod"
import auth from "./auth/route.js"
import context from "./context/route.js"
import { AppError } from "./errors.js"

function llmUpstreamResponse(err: APICallError) {
	const upstreamStatus = err.statusCode ?? 0
	const upstreamMessage =
		(err.data as { error?: { message?: string } } | undefined)?.error?.message ?? err.message
	return {
		body: {
			error: `LLM upstream (${upstreamStatus}): ${upstreamMessage}`,
			code: "LLM_UPSTREAM_ERROR" as const,
		},
		status: upstreamStatus === 429 ? (429 as const) : (502 as const),
	}
}

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

	if (APICallError.isInstance(err)) {
		const { body, status } = llmUpstreamResponse(err)
		return c.json(body, status)
	}

	if (RetryError.isInstance(err) && APICallError.isInstance(err.lastError)) {
		const { body, status } = llmUpstreamResponse(err.lastError)
		return c.json({ ...body, error: `${body.error} (after ${err.errors.length} retries)` }, status)
	}

	console.error(err)

	return c.json({ error: "Internal server error" }, 500)
})

app.route("/auth", auth)
app.route("/context", context)

export default app
