import { prisma } from "@dd-chat/db"
import { appRouter, createContext } from "@dd-chat/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { Hono } from "hono"
import { getCookie } from "hono/cookie"
import { publicUserSelect } from "../auth/service.js"
import { getActiveSessionByToken } from "../auth/session.js"

async function resolveUserFromRequest(token: string | undefined) {
	if (!token) return null
	const session = await getActiveSessionByToken(token)
	if (!session) return null
	return prisma.user.findUnique({
		where: { id: session.userId },
		select: publicUserSelect,
	})
}

const app = new Hono()

app.all("/*", async (c) => {
	const token = getCookie(c, "session")
	const user = await resolveUserFromRequest(token)

	return fetchRequestHandler({
		endpoint: "/trpc",
		req: c.req.raw,
		router: appRouter,
		createContext: () => createContext({ user }),
		onError(opts: { error: { code: string }; path?: string | undefined }) {
			if (opts.error.code === "INTERNAL_SERVER_ERROR") {
				console.error(`[trpc] ${opts.path ?? "<no-path>"}:`, opts.error)
			}
		},
	})
})

export default app
