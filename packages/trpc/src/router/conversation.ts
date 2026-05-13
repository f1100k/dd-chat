import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure, router } from "../trpc.js"

const createInput = z.object({
	title: z.string().trim().min(1).max(200).optional(),
})

const idInput = z.object({
	id: z.string().uuid(),
})

export const conversationRouter = router({
	list: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.conversation.findMany({
			where: { userId: ctx.user.id },
			orderBy: { updatedAt: "desc" },
			select: {
				id: true,
				title: true,
				createdAt: true,
				updatedAt: true,
			},
		})
	}),

	byId: protectedProcedure.input(idInput).query(async ({ ctx, input }) => {
		const conversation = await ctx.db.conversation.findFirst({
			where: { id: input.id, userId: ctx.user.id },
			select: {
				id: true,
				title: true,
				createdAt: true,
				updatedAt: true,
			},
		})
		if (!conversation) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" })
		}
		return conversation
	}),

	create: protectedProcedure.input(createInput).mutation(async ({ ctx, input }) => {
		return ctx.db.conversation.create({
			data: {
				userId: ctx.user.id,
				title: input.title ?? null,
			},
			select: {
				id: true,
				title: true,
				createdAt: true,
				updatedAt: true,
			},
		})
	}),

	delete: protectedProcedure.input(idInput).mutation(async ({ ctx, input }) => {
		// Confirmar ownership antes de deletar (deleteMany retorna count, sem 404 nativo).
		const owned = await ctx.db.conversation.findFirst({
			where: { id: input.id, userId: ctx.user.id },
			select: { id: true },
		})
		if (!owned) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" })
		}
		await ctx.db.conversation.delete({ where: { id: input.id } })
		return { id: input.id }
	}),
})
