import z from "zod"

const USERNAME_REGEX = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9]))*$/

const signupSchema = z.object({
	email: z.email("Invalid email").max(254, "Email too long"),
	displayName: z
		.string()
		.trim()
		.min(3, "Display name should have at least 3 characters")
		.max(39, "Display name should have maximum of 39 characters"),
	username: z
		.string()
		.trim()
		.toLowerCase()
		.min(3, "Username should have at least 3 characters")
		.max(30, "Username should have maximum of 39 characters")
		.regex(
			USERNAME_REGEX,
			"Utilize only letters, numbers and hifens. Do not start/finish with hifen or have consecutive hifens",
		),
	password: z.string().min(8).max(64),
})

const loginSchema = z.object({
	identifier: z.string(),
	password: z.string(),
})

export { loginSchema, signupSchema }
