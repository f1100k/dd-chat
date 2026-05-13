import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import type { LanguageModel } from "ai"
import { AppError } from "../errors.js"

class LLMNotConfiguredError extends AppError {
	constructor() {
		super(
			"OPENROUTER_API_KEY is not set. Add it to .env to use LLM-based features.",
			503,
			"LLM_NOT_CONFIGURED",
		)
	}
}

let cached: { provider: ReturnType<typeof createOpenRouter>; key: string } | null = null

function getProvider(): ReturnType<typeof createOpenRouter> {
	const apiKey = process.env.OPENROUTER_API_KEY
	if (!apiKey) throw new LLMNotConfiguredError()
	if (cached && cached.key === apiKey) return cached.provider
	cached = { key: apiKey, provider: createOpenRouter({ apiKey }) }
	return cached.provider
}

export const DEFAULT_INTENT_MODEL_ID =
	process.env.INTENT_MODEL_ID ?? "meta-llama/llama-3.3-70b-instruct:free"

/**
 * Lista de modelos passada ao OpenRouter como `models` (fallback automático).
 * Quando o primeiro estiver com rate-limit, o OpenRouter tenta o próximo da fila.
 * Customizável via env `INTENT_MODEL_FALLBACKS` (CSV).
 */
/** OpenRouter aceita no máximo 3 itens nessa lista. */
const MAX_FALLBACKS = 3

export const INTENT_MODEL_FALLBACKS: string[] = (
	process.env.INTENT_MODEL_FALLBACKS ??
	[
		DEFAULT_INTENT_MODEL_ID,
		"qwen/qwen3-next-80b-a3b-instruct:free",
		"openai/gpt-oss-120b:free",
	].join(",")
)
	.split(",")
	.map((s) => s.trim())
	.filter(Boolean)
	.slice(0, MAX_FALLBACKS)

export function intentModel(): LanguageModel {
	// IMPORTANTE: `models` precisa entrar AQUI em `settings`, não em providerOptions per-call.
	// O provider OpenRouter lê de `this.settings.models` ao montar o body do request.
	return getProvider().chat(DEFAULT_INTENT_MODEL_ID, {
		models: INTENT_MODEL_FALLBACKS,
	}) as unknown as LanguageModel
}
