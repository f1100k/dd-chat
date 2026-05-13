import { prisma } from "@dd-chat/db"
import { createUser } from "../../helpers/factories/user"
import { anonCaller, makeCaller } from "../../helpers/trpc"

describe("trpc: message.*", () => {
	test("list throws UNAUTHORIZED when anonymous", async () => {
		await expect(
			anonCaller().message.list({ conversationId: "00000000-0000-0000-0000-000000000000" }),
		).rejects.toMatchObject({ code: "UNAUTHORIZED" })
	})

	test("list returns messages in chronological order for the owner", async () => {
		const { user } = await createUser()
		const caller = makeCaller(user)
		const conv = await caller.conversation.create({ title: "thread" })

		await prisma.message.createMany({
			data: [
				{
					conversationId: conv.id,
					role: "USER",
					content: "como funciona fireball?",
					selectedCategories: ["spells"],
					injectedContext: "## Fireball ...",
				},
				{
					conversationId: conv.id,
					role: "ASSISTANT",
					content: "Fireball é uma magia de 3º nível...",
				},
			],
		})

		const messages = await caller.message.list({ conversationId: conv.id })
		expect(messages).toHaveLength(2)
		expect(messages[0]?.role).toBe("USER")
		expect(messages[0]?.selectedCategories).toEqual(["spells"])
		expect(messages[0]?.injectedContext).toContain("Fireball")
		expect(messages[1]?.role).toBe("ASSISTANT")
		expect(messages[1]?.injectedContext).toBeNull()
	})

	test("list returns NOT_FOUND for someone else's conversation", async () => {
		const { user: owner } = await createUser()
		const { user: other } = await createUser()
		const conv = await makeCaller(owner).conversation.create({ title: "private" })
		await prisma.message.create({
			data: { conversationId: conv.id, role: "USER", content: "secret" },
		})

		await expect(makeCaller(other).message.list({ conversationId: conv.id })).rejects.toMatchObject(
			{ code: "NOT_FOUND" },
		)
	})

	test("list rejects malformed conversationId", async () => {
		const { user } = await createUser()
		await expect(
			makeCaller(user).message.list({ conversationId: "not-a-uuid" }),
		).rejects.toMatchObject({ code: "BAD_REQUEST" })
	})
})
