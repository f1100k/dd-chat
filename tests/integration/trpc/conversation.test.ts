import { prisma } from "@dd-chat/db"
import { TRPCError } from "@trpc/server"
import { createUser } from "../../helpers/factories/user"
import { anonCaller, makeCaller } from "../../helpers/trpc"

describe("trpc: conversation.*", () => {
	describe("anonymous", () => {
		test("list throws UNAUTHORIZED", async () => {
			await expect(anonCaller().conversation.list()).rejects.toThrow(TRPCError)
		})

		test("create throws UNAUTHORIZED", async () => {
			await expect(anonCaller().conversation.create({ title: "x" })).rejects.toThrow(TRPCError)
		})
	})

	describe("create + list", () => {
		test("create returns the conversation and list returns it for the owner", async () => {
			const { user } = await createUser()
			const caller = makeCaller(user)

			const created = await caller.conversation.create({ title: "Goblin ambush" })
			expect(created.title).toBe("Goblin ambush")
			expect(created.id).toBeDefined()

			const list = await caller.conversation.list()
			expect(list).toHaveLength(1)
			expect(list[0]?.id).toBe(created.id)
		})

		test("create with omitted title persists null", async () => {
			const { user } = await createUser()
			const caller = makeCaller(user)

			const created = await caller.conversation.create({})
			expect(created.title).toBeNull()
		})

		test("list is scoped per user (cross-user isolation)", async () => {
			const { user: u1 } = await createUser()
			const { user: u2 } = await createUser()

			await makeCaller(u1).conversation.create({ title: "u1 conv" })
			await makeCaller(u2).conversation.create({ title: "u2 conv" })

			const list1 = await makeCaller(u1).conversation.list()
			const list2 = await makeCaller(u2).conversation.list()

			expect(list1).toHaveLength(1)
			expect(list1[0]?.title).toBe("u1 conv")
			expect(list2).toHaveLength(1)
			expect(list2[0]?.title).toBe("u2 conv")
		})

		test("list returns conversations ordered by updatedAt desc", async () => {
			const { user } = await createUser()
			const caller = makeCaller(user)

			const c1 = await caller.conversation.create({ title: "first" })
			// força updatedAt depois pra garantir ordenação
			await new Promise((r) => setTimeout(r, 5))
			const c2 = await caller.conversation.create({ title: "second" })

			const list = await caller.conversation.list()
			expect(list.map((c) => c.id)).toEqual([c2.id, c1.id])
		})
	})

	describe("byId", () => {
		test("returns the conversation for the owner", async () => {
			const { user } = await createUser()
			const caller = makeCaller(user)
			const created = await caller.conversation.create({ title: "mine" })

			const found = await caller.conversation.byId({ id: created.id })
			expect(found.id).toBe(created.id)
			expect(found.title).toBe("mine")
		})

		test("returns NOT_FOUND for someone else's conversation (no info leak)", async () => {
			const { user: owner } = await createUser()
			const { user: other } = await createUser()
			const conv = await makeCaller(owner).conversation.create({ title: "private" })

			await expect(makeCaller(other).conversation.byId({ id: conv.id })).rejects.toMatchObject({
				code: "NOT_FOUND",
			})
		})

		test("returns NOT_FOUND for nonexistent uuid", async () => {
			const { user } = await createUser()
			await expect(
				makeCaller(user).conversation.byId({ id: "00000000-0000-0000-0000-000000000000" }),
			).rejects.toMatchObject({ code: "NOT_FOUND" })
		})

		test("rejects malformed id with BAD_REQUEST", async () => {
			const { user } = await createUser()
			await expect(makeCaller(user).conversation.byId({ id: "not-a-uuid" })).rejects.toMatchObject({
				code: "BAD_REQUEST",
			})
		})
	})

	describe("delete", () => {
		test("deletes the conversation for the owner", async () => {
			const { user } = await createUser()
			const caller = makeCaller(user)
			const created = await caller.conversation.create({ title: "del me" })

			const result = await caller.conversation.delete({ id: created.id })
			expect(result.id).toBe(created.id)

			const remaining = await caller.conversation.list()
			expect(remaining).toHaveLength(0)
		})

		test("cascades to messages", async () => {
			const { user } = await createUser()
			const caller = makeCaller(user)
			const conv = await caller.conversation.create({ title: "msgs" })

			await prisma.message.createMany({
				data: [
					{ conversationId: conv.id, role: "USER", content: "hi" },
					{ conversationId: conv.id, role: "ASSISTANT", content: "hello" },
				],
			})

			expect(await prisma.message.count({ where: { conversationId: conv.id } })).toBe(2)

			await caller.conversation.delete({ id: conv.id })

			expect(await prisma.message.count({ where: { conversationId: conv.id } })).toBe(0)
		})

		test("returns NOT_FOUND when trying to delete someone else's", async () => {
			const { user: owner } = await createUser()
			const { user: other } = await createUser()
			const conv = await makeCaller(owner).conversation.create({ title: "private" })

			await expect(makeCaller(other).conversation.delete({ id: conv.id })).rejects.toMatchObject({
				code: "NOT_FOUND",
			})

			// Ainda existe no banco
			expect(await prisma.conversation.findUnique({ where: { id: conv.id } })).not.toBeNull()
		})
	})
})
