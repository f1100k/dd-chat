import { prisma } from "@dd-chat/db"
import { userPublicSchema } from "@dd-chat/validators"
import bcrypt from "bcrypt"
import { app } from "../../../helpers/app"
import { createUser, validSignupBody } from "../../../helpers/factories/user"
import type { ApiError, ZodErrorResponse } from "../../../helpers/types"

type SignupResponse = {
	id: string
	email: string
	username: string
	displayName: string
	createdAt: string
	updatedAt: string
}

describe("POST /signup", () => {
	test("with valid body should return 201", async () => {
		const body = validSignupBody()

		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})

		expect(response.status).toBe(201)

		const user = userPublicSchema.strict().parse(await response.json())
		expect(user.email).toBe(body.email)
		expect(user.username).toBe(body.username)
		expect(user.displayName).toBe(body.displayName)

		const dbUser = await prisma.user.findUniqueOrThrow({
			where: { email: body.email },
		})

		expect(dbUser.id).toBe(user.id)
		expect(dbUser.passwordHash).not.toBe(body.password)

		const correctPasswordMatch = await bcrypt.compare(body.password, dbUser.passwordHash)
		expect(correctPasswordMatch).toBeTruthy()

		const incorrectPasswordMatch = await bcrypt.compare("not corrected", dbUser.passwordHash)
		expect(incorrectPasswordMatch).toBeFalsy()
	})

	test("username is lowercased before persisting and should return 201", async () => {
		const body = validSignupBody({ username: "USERtest" })

		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})

		expect(response.status).toBe(201)

		const responseBody = (await response.json()) as SignupResponse
		expect(responseBody.username).toBe("usertest")

		const dbUser = await prisma.user.findUniqueOrThrow({
			where: { email: body.email },
		})

		expect(dbUser.username).toBe("usertest")
	})

	test("displayName preserves the original input", async () => {
		const displayName = "João da SILVA"
		const body = validSignupBody({ displayName })

		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})

		expect(response.status).toBe(201)

		const responseBody = (await response.json()) as SignupResponse
		expect(responseBody.displayName).toBe(displayName)

		const dbUser = await prisma.user.findUniqueOrThrow({
			where: { email: body.email },
		})

		expect(dbUser.displayName).toBe(displayName)
	})

	test("with duplicated email should return 409", async () => {
		const body = validSignupBody()
		await createUser({ email: body.email })

		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})

		expect(response.status).toBe(409)

		const responseBody = (await response.json()) as ApiError

		expect(responseBody).toEqual({
			code: "CONFLICT",
			error: "A user with this email or username already exists",
		})

		const userCount = await prisma.user.count()
		expect(userCount).toBe(1)
	})

	test("with duplicated username should return 409", async () => {
		const body = validSignupBody()
		await createUser({ username: body.username })

		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})

		expect(response.status).toBe(409)

		const responseBody = (await response.json()) as ApiError

		expect(responseBody).toEqual({
			code: "CONFLICT",
			error: "A user with this email or username already exists",
		})

		const userCount = await prisma.user.count()
		expect(userCount).toBe(1)
	})

	test("with empty body should return 400", async () => {
		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({}),
		})

		const responseBody = (await response.json()) as ZodErrorResponse

		expect(response.status).toBe(400)
		expect(responseBody.issues.length).toBe(4)
	})

	test("with password less than 8 characters should return 400", async () => {
		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(validSignupBody({ password: "1234567" })),
		})

		const responseBody = (await response.json()) as ZodErrorResponse

		expect(response.status).toBe(400)
		expect(responseBody.issues.length).toBe(1)
		expect(responseBody.issues[0]?.message).toBe(
			"Too small: expected string to have >=8 characters",
		)
	})

	test.for([
		{ problem: "username with consecutive hifens", username: "user--test" },
		{ problem: "username starting with hifen", username: "-usertest" },
		{ problem: "username finishing with hifen", username: "usertest-" },
	])("with $problem should return 400", async ({ username }) => {
		const response = await app.request("/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(validSignupBody({ username })),
		})

		const responseBody = (await response.json()) as ZodErrorResponse

		expect(response.status).toBe(400)
		expect(responseBody.issues.length).toBe(1)
		expect(responseBody.issues[0]?.message).toBe(
			"Utilize only letters, numbers and hifens. Do not start/finish with hifen or have consecutive hifens",
		)
	})
})
