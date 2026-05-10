import { app } from "./app"
import { createUser } from "./factories/user"

export async function loginAndGetCookie() {
	const { user, password } = await createUser()

	const response = await app.request("/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ identifier: user.email, password }),
	})

	const setCookie = response.headers.get("set-cookie")

	if (!setCookie) {
		throw new Error("login did not return a set-cookie header")
	}

	const cookie = setCookie.split(";")[0]

	if (!cookie) {
		throw new Error("could not parse session cookie")
	}

	return { user, cookie }
}
