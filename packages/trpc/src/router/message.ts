import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure, router } from "../trpc.js"

const listInput = z.object({
	conversationId: z.string().uuid(),
})

export const messageRouter = router({
	list: protectedProcedure.input(listInput).query(async ({ ctx, input }) => {
		// Ownership check: garante que a conversa pertence ao user antes de listar mensagens.
		const conversation = await ctx.db.conversation.findFirst({
			where: { id: input.conversationId, userId: ctx.user.id },
			select: { id: true },
		})
		if (!conversation) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" })
		}

		return ctx.db.message.findMany({
			where: { conversationId: input.conversationId },
			orderBy: { createdAt: "asc" },
			select: {
				id: true,
				role: true,
				content: true,
				selectedCategories: true,
				injectedContext: true,
				createdAt: true,
			},
		})
	}),
})
