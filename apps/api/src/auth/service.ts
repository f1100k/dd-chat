import { Prisma, prisma } from "@dd-chat/db"
import { signupSchema, loginSchema } from "@dd-chat/validators"
import type { z } from "zod"
import { AuthenticationError, ConflictError } from "../errors.js"
import { hashPassword, verifyPassword } from "./password.js"
import { createSession } from "./session.js"

type SignupInput = z.infer<typeof signupSchema>
type LoginInput = z.infer<typeof loginSchema>

const publicUserSelect = {
	id: true,
	email: true,
	username: true,
	displayName: true,
	createdAt: true,
	updatedAt: true,
} as const

export async function signupUser(input: SignupInput) {
	const passwordHash = await hashPassword(input.password)

	try {
		return await prisma.user.create({
			data: {
				email: input.email,
				username: input.username,
				displayName: input.displayName,
				passwordHash,
			},
			select: publicUserSelect,
		})
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
			throw new ConflictError("A user with this email or username already exists", { cause: err })
		}
		throw err
	}
}

export async function loginUser(input: LoginInput) {
	const user = await prisma.user.findFirst({
		where: {
			OR: [{ username: input.identifier }, { email: input.identifier }],
		},
	})

	if (!user) {
		throw new AuthenticationError("Invalid credentials")
	}

	const passwordMatches = await verifyPassword(input.password, user.passwordHash)

	if (!passwordMatches) {
		throw new AuthenticationError("Invalid credentials")
	}

	const session = await createSession(user.id)
	const { passwordHash: _passwordHash, ...publicUser } = user

	return { user: publicUser, session }
}
