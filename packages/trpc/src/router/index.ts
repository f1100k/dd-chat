import { router } from "../trpc.js"
import { conversationRouter } from "./conversation.js"
import { messageRouter } from "./message.js"

export const appRouter = router({
	conversation: conversationRouter,
	message: messageRouter,
})

export type AppRouter = typeof appRouter
