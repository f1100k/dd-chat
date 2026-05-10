import type { ZodIssue } from "zod"

export type ApiError = {
	code: string
	error: string
}

export type ZodErrorResponse = {
	error: string
	issues: ZodIssue[]
}
