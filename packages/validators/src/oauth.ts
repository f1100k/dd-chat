import z from "zod"

export const oauthProviderSchema = z.enum(["google"])
export type OAuthProvider = z.infer<typeof oauthProviderSchema>

export const oauthCallbackQuerySchema = z.object({
	code: z.string().min(1).optional(),
	state: z.string().min(1).optional(),
	error: z.string().min(1).optional(),
	error_description: z.string().optional(),
})

export type OAuthCallbackQuery = z.infer<typeof oauthCallbackQuerySchema>

export const googleTokenResponseSchema = z.object({
	access_token: z.string().min(1),
	id_token: z.string().min(1),
	expires_in: z.number().int().positive().optional(),
	token_type: z.string().optional(),
	scope: z.string().optional(),
	refresh_token: z.string().optional(),
})

export type GoogleTokenResponse = z.infer<typeof googleTokenResponseSchema>

export const googleIdTokenPayloadSchema = z.object({
	iss: z.string(),
	sub: z.string().min(1),
	aud: z.string(),
	exp: z.number().int().positive(),
	iat: z.number().int().positive(),
	email: z.email(),
	email_verified: z.boolean(),
	name: z.string().optional(),
	picture: z.url().optional(),
})

export type GoogleIdTokenPayload = z.infer<typeof googleIdTokenPayloadSchema>
