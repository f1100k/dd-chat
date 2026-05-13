import { appRouter, type Context, createCallerFactory, createContext } from "@dd-chat/trpc"

const callerFactory = createCallerFactory(appRouter)

export function makeCaller(user: Context["user"]) {
	return callerFactory(createContext({ user }))
}

export const anonCaller = () => makeCaller(null)
