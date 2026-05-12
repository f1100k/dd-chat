import { loginSchema, oauthCallbackQuerySchema, signupSchema } from "@dd-chat/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { getCookie } from "hono/cookie"
import { BadRequestError } from "../errors.js"
import { buildAuthUrl, exchangeCodeForTokens, verifyIdToken } from "./google.js"
import { type AuthEnv, authMiddleware } from "./middleware.js"
import {
	clearStateCookie,
	findOrCreateGoogleUser,
	generateState,
	getStateCookie,
	setStateCookie,
} from "./oauth.js"
import { loginUser, signupUser } from "./service.js"
import { clearSessionCookie, createSession, revokeSession, setSessionCookie } from "./session.js"

const POST_LOGIN_REDIRECT = process.env.OAUTH_POST_LOGIN_REDIRECT ?? "/"

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

app.get("/google", (c) => {
	const state = generateState()
	setStateCookie(c, state)
	return c.redirect(buildAuthUrl(state), 302)
})

app.get(
	"/google/callback",
	zValidator("query", oauthCallbackQuerySchema, throwOnInvalid),
	async (c) => {
		const query = c.req.valid("query")
		const cookieState = getStateCookie(c)
		clearStateCookie(c)

		if (query.error) {
			throw new BadRequestError(`Google OAuth error: ${query.error}`)
		}

		if (!query.code || !query.state) {
			throw new BadRequestError("Missing code or state")
		}

		if (!cookieState || cookieState !== query.state) {
			throw new BadRequestError("Invalid OAuth state")
		}

		const tokens = await exchangeCodeForTokens(query.code)
		const payload = await verifyIdToken(tokens.id_token)
		const user = await findOrCreateGoogleUser(payload)
		const session = await createSession(user.id)
		setSessionCookie(c, session)

		return c.redirect(POST_LOGIN_REDIRECT, 302)
	},
)

export default app
