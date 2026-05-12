import { signupUser } from "@dd-chat/api/auth/service"
import type { signupSchema } from "@dd-chat/validators"
import { faker } from "@faker-js/faker"
import type { z } from "zod"

type SignupBody = z.infer<typeof signupSchema>

export function validSignupBody(overrides: Partial<SignupBody> = {}): SignupBody {
	return {
		email: overrides.email ?? faker.internet.email().toLowerCase(),
		username: overrides.username ?? faker.string.alphanumeric({ length: 12, casing: "lower" }),
		displayName: overrides.displayName ?? faker.person.fullName(),
		password: overrides.password ?? faker.internet.password({ length: 12 }),
	}
}

export async function createUser(overrides: Partial<SignupBody> = {}) {
	const body = validSignupBody(overrides)
	const user = await signupUser(body)
	return { user, password: body.password }
}
