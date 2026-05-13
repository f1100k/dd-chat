import { lookupEntries } from "@dd-chat/context"
import { CATEGORY_KEYS, type CategoryKey } from "@dd-chat/validators"
import { generateText, type LanguageModel, type ToolSet, tool } from "ai"
import { z } from "zod"
import { DEFAULT_INTENT_MODEL_ID, INTENT_MODEL_FALLBACKS, intentModel } from "../llm/client.js"
import { logError, logRequest, logResponse } from "../llm/logging.js"

const INTENT_SYSTEM = `You are an intent classifier for a D&D 5e reference assistant.
The user is asking a question about D&D. Your job is to call the appropriate lookup_<category>(query) tool(s) to fetch the specific entries the user is asking about.

Rules:
- Always pass the canonical English name in \`query\`, even if the user wrote it in another language or with typos. Example: user says "como funciona a magia bola de fogo" → call lookup_spells("Fireball"). User says "fure ball" → call lookup_spells("Fireball").
- Call only the tools whose categories are available (one tool per selected category).
- Call multiple tools if the user is asking about multiple entries/categories.
- If the user's question is broad/general (e.g. "what spells exist?", "list all monsters"), do NOT call any tool — let the system fall back to full-category injection.
- If the user is greeting/chatting without referring to any specific entry, do NOT call any tool.
- Output no prose; only tool calls.`

export interface ToolCallRecord {
	category: CategoryKey
	query: string
	matched: string[]
}

export interface IntentResult {
	model: string
	provider?: string | undefined
	generationId?: string | undefined
	toolCalls: ToolCallRecord[]
	matchedRenders: string[]
	inputTokens: number
	outputTokens: number
	latencyMs: number
}

export interface IdentifyIntentInput {
	selectedCategories: CategoryKey[]
	userMessage: string
}

export interface IdentifyIntentOpts {
	model?: LanguageModel
}

function buildToolsFor(categories: CategoryKey[]): ToolSet {
	return Object.fromEntries(
		categories.map((cat) => [
			`lookup_${cat}`,
			tool({
				description: `Look up specific entries in the ${cat} reference. Use the canonical English name.`,
				inputSchema: z.object({
					query: z
						.string()
						.describe(`Canonical English name of the ${cat} entry the user is asking about`),
				}),
				execute: async ({ query }) => ({
					matched: lookupEntries(cat, query).map((h) => h.name),
				}),
			}),
		]),
	) as ToolSet
}

function isValidCategory(key: string): key is CategoryKey {
	return (CATEGORY_KEYS as readonly string[]).includes(key)
}

function extractOpenRouterMeta(meta: unknown): { provider?: string; generationId?: string } {
	const m = meta as { openrouter?: { provider?: string; id?: string } } | undefined
	const out: { provider?: string; generationId?: string } = {}
	if (m?.openrouter?.provider) out.provider = m.openrouter.provider
	if (m?.openrouter?.id) out.generationId = m.openrouter.id
	return out
}

export async function identifyIntent(
	input: IdentifyIntentInput,
	opts: IdentifyIntentOpts = {},
): Promise<IntentResult> {
	const model = opts.model ?? intentModel()
	const tools = buildToolsFor(input.selectedCategories)
	const modelId = DEFAULT_INTENT_MODEL_ID

	logRequest({
		method: "v2/generateText",
		model: modelId,
		fallbacks: INTENT_MODEL_FALLBACKS,
		prompt: input.userMessage,
	})

	const t0 = Date.now()
	let result: Awaited<ReturnType<typeof generateText>>
	try {
		result = await generateText({
			model,
			system: INTENT_SYSTEM,
			prompt: input.userMessage,
			tools,
			toolChoice: "auto",
			stopWhen: ({ steps }) => steps.length >= 4,
		})
	} catch (err) {
		logError({ method: "v2/generateText", model: modelId, err })
		throw err
	}
	const latencyMs = Date.now() - t0

	const toolCalls: ToolCallRecord[] = []
	const matchedRenders: string[] = []

	for (const step of result.steps) {
		for (const tc of step.toolCalls ?? []) {
			const toolName = tc.toolName
			if (!toolName.startsWith("lookup_")) continue
			const cat = toolName.slice("lookup_".length)
			if (!isValidCategory(cat)) continue
			const args = tc.input as { query?: string }
			const query = args.query ?? ""

			const hits = lookupEntries(cat, query)
			toolCalls.push({ category: cat, query, matched: hits.map((h) => h.name) })
			for (const h of hits) matchedRenders.push(h.rendered)
		}
	}

	const usage = result.totalUsage ?? result.usage ?? { inputTokens: 0, outputTokens: 0 }
	const { provider, generationId } = extractOpenRouterMeta(result.providerMetadata)
	// modelo real servido (pode diferir do `modelId` quando o `models` fallback do OpenRouter rotou)
	const servedModel = result.response?.modelId ?? modelId

	console.log(
		`  ${"\x1b[2m"}steps=${result.steps.length} per_step_usage=${JSON.stringify(
			result.steps.map((s) => ({
				in: s.usage?.inputTokens ?? 0,
				out: s.usage?.outputTokens ?? 0,
				toolCalls: (s.toolCalls ?? []).map((tc) => tc.toolName),
				finishReason: s.finishReason,
			})),
		)}${"\x1b[0m"}`,
	)

	logResponse({
		method: "v2/generateText",
		model: servedModel,
		provider,
		generationId,
		inputTokens: usage.inputTokens ?? 0,
		outputTokens: usage.outputTokens ?? 0,
		latencyMs,
		finishReason: result.finishReason,
	})

	return {
		model: servedModel,
		provider,
		generationId,
		toolCalls,
		matchedRenders,
		inputTokens: usage.inputTokens ?? 0,
		outputTokens: usage.outputTokens ?? 0,
		latencyMs,
	}
}
