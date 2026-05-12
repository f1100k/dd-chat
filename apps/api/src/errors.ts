import type { ContentfulStatusCode } from "hono/utils/http-status"

export abstract class AppError extends Error {
	constructor(
		message: string,
		public readonly statusCode: ContentfulStatusCode,
		public readonly code: string,
		errorOptions?: ErrorOptions,
	) {
		super(message, errorOptions)
		this.name = this.constructor.name
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string, options?: ErrorOptions) {
		super(message, 401, "AUTHENTICATION_FAILED", options)
	}
}

export class ConflictError extends AppError {
	constructor(message: string, options?: ErrorOptions) {
		super(message, 409, "CONFLICT", options)
	}
}
