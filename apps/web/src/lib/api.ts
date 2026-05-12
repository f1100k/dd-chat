export class ApiError extends Error {
	readonly status: number
	readonly code: string | undefined
	readonly issues: unknown

	constructor(opts: {
		status: number
		message: string
		code: string | undefined
		issues: unknown
	}) {
		super(opts.message)
		this.name = "ApiError"
		this.status = opts.status
		this.code = opts.code
		this.issues = opts.issues
	}
}

type ApiErrorBody = { error?: string; code?: string; issues?: unknown }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
	const headers = new Headers(init.headers)
	if (init.body && !headers.has("content-type")) {
		headers.set("content-type", "application/json")
	}

	const res = await fetch(path, { ...init, credentials: "include", headers })

	if (res.status === 204) return undefined as T

	const text = await res.text()
	const body = text ? (JSON.parse(text) as unknown) : undefined

	if (!res.ok) {
		const errBody = (body ?? {}) as ApiErrorBody
		throw new ApiError({
			status: res.status,
			message: errBody.error ?? `Request failed (${res.status})`,
			code: errBody.code,
			issues: errBody.issues,
		})
	}

	return body as T
}

export const api = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body: unknown) =>
		request<T>(path, { method: "POST", body: JSON.stringify(body) }),
}
