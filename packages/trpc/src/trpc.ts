import { prisma } from "@dd-chat/db"
import { initTRPC, TRPCError } from "@trpc/server"

/**
 * Shape mínimo necessário das procedures pra fazer ownership checks. Não usamos
 * `UserPublic` dos validators porque aquele tem `createdAt: string` (wire format),
 * enquanto o Prisma devolve `Date`. Aqui o que importa é só `id`.
 */
export interface ContextUser {
	id: string
	email: string
	username: string
	displayName: string
}

export interface CreateContextInput {
	user: ContextUser | null
}

/**
 * Context que será injetado em toda procedure. `user` vem do middleware de auth
 * (cookie de sessão) — null se a request não está autenticada.
 */
export function createContext(input: CreateContextInput) {
	return {
		db: prisma,
		user: input.user,
	}
}

export type Context = ReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory

const isAuthed = middleware(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthenticated" })
	}
	return next({
		ctx: {
			...ctx,
			user: ctx.user,
		},
	})
})

export const protectedProcedure = publicProcedure.use(isAuthed)
