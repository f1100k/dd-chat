import { buildPrompt, composeSystemPrompt } from "@dd-chat/context"
import { type ContextPreviewV2Response, contextPreviewRequestSchema } from "@dd-chat/validators"
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { type AuthEnv, authMiddleware } from "../auth/middleware.js"
import { type IdentifyIntentInput, type IntentResult, identifyIntent } from "./intent.js"
import { identifyIntentV3 } from "./intent-v3.js"

const app = new Hono<AuthEnv>()

const throwOnInvalid = (result: { success: boolean; error?: unknown }) => {
	if (!result.success) {
		throw result.error
	}
}

type IntentFn = (input: IdentifyIntentInput) => Promise<IntentResult>

async function runIntentPreview(
	input: IdentifyIntentInput,
	intentFn: IntentFn,
): Promise<ContextPreviewV2Response> {
	const fullInjectionChars = buildPrompt(input).injectedContext.length
	const intent = await intentFn(input)

	const intentMeta = {
		model: intent.model,
		...(intent.provider ? { provider: intent.provider } : {}),
		...(intent.generationId ? { generationId: intent.generationId } : {}),
		toolCalls: intent.toolCalls,
		inputTokens: intent.inputTokens,
		outputTokens: intent.outputTokens,
		latencyMs: intent.latencyMs,
	}

	if (intent.matchedRenders.length === 0) {
		const full = buildPrompt(input)
		return {
			mode: "fallback-full",
			systemPrompt: full.systemPrompt,
			injectedContext: full.injectedContext,
			intent: intentMeta,
			fullInjectionChars,
		}
	}

	const injectedContext = intent.matchedRenders.join("\n\n")
	return {
		mode: "targeted",
		systemPrompt: composeSystemPrompt(injectedContext),
		injectedContext,
		intent: intentMeta,
		fullInjectionChars,
	}
}

app.post(
	"/preview",
	authMiddleware,
	zValidator("json", contextPreviewRequestSchema, throwOnInvalid),
	(c) => {
		const result = buildPrompt(c.req.valid("json"))
		return c.json(result, 200)
	},
)

app.post(
	"/preview-v2",
	authMiddleware,
	zValidator("json", contextPreviewRequestSchema, throwOnInvalid),
	async (c) => c.json(await runIntentPreview(c.req.valid("json"), identifyIntent), 200),
)

app.post(
	"/preview-v3",
	authMiddleware,
	zValidator("json", contextPreviewRequestSchema, throwOnInvalid),
	async (c) => c.json(await runIntentPreview(c.req.valid("json"), identifyIntentV3), 200),
)

export default app
