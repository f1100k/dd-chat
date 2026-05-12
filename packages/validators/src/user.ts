import z from "zod"

export const userPublicSchema = z.object({
	id: z.uuid(),
	email: z.string(),
	username: z.string(),
	displayName: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type UserPublic = z.infer<typeof userPublicSchema>
