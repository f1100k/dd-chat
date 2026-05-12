import { prisma } from "@dd-chat/db"
import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { AuthenticationError } from "../errors.js"
import { type PublicUser, publicUserSelect } from "./service.js"
import { getActiveSessionByToken } from "./session.js"

type ActiveSession = NonNullable<Awaited<ReturnType<typeof getActiveSessionByToken>>>

export type AuthEnv = {
	Variables: {
		user: PublicUser
		session: ActiveSession
	}
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
	const token = getCookie(c, "session")

	if (!token) {
		throw new AuthenticationError("Unauthenticated")
	}

	const session = await getActiveSessionByToken(token)

	if (!session) {
		throw new AuthenticationError("Unauthenticated")
	}

	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		select: publicUserSelect,
	})

	if (!user) {
		throw new AuthenticationError("Unauthenticated")
	}

	c.set("user", user)
	c.set("session", session)

	await next()
})
