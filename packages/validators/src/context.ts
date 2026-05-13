import z from "zod"

export const CATEGORY_KEYS = [
	"spells",
	"monsters",
	"classes",
	"items",
	"combat",
	"abilities",
] as const

export const categoryKeySchema = z.enum(CATEGORY_KEYS)
export type CategoryKey = z.infer<typeof categoryKeySchema>

export const contextPreviewRequestSchema = z.object({
	selectedCategories: z.array(categoryKeySchema).max(CATEGORY_KEYS.length),
	userMessage: z.string().max(4000).default(""),
})

export type ContextPreviewRequest = z.infer<typeof contextPreviewRequestSchema>

export const contextPreviewResponseSchema = z.object({
	systemPrompt: z.string(),
	injectedContext: z.string(),
})

export type ContextPreviewResponse = z.infer<typeof contextPreviewResponseSchema>

export const toolCallSchema = z.object({
	category: categoryKeySchema,
	query: z.string(),
	matched: z.array(z.string()),
})

export const intentMetaSchema = z.object({
	model: z.string(),
	provider: z.string().optional(),
	generationId: z.string().optional(),
	toolCalls: z.array(toolCallSchema),
	inputTokens: z.number().int().nonnegative(),
	outputTokens: z.number().int().nonnegative(),
	latencyMs: z.number().nonnegative(),
})

export const contextPreviewV2ResponseSchema = z.object({
	mode: z.enum(["targeted", "fallback-full"]),
	systemPrompt: z.string(),
	injectedContext: z.string(),
	intent: intentMetaSchema,
	fullInjectionChars: z.number().int().nonnegative(),
})

export type ContextPreviewV2Response = z.infer<typeof contextPreviewV2ResponseSchema>
