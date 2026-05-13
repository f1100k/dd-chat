import { lookupEntries } from "@dd-chat/context"
import { type CategoryKey, categoryKeySchema } from "@dd-chat/validators"
import { generateText, stepCountIs, type ToolSet, tool } from "ai"
import { z } from "zod"
import { DEFAULT_INTENT_MODEL_ID, INTENT_MODEL_FALLBACKS, intentModel } from "../llm/client.js"
import { logError, logRequest, logResponse } from "../llm/logging.js"
import type {
	IdentifyIntentInput,
	IdentifyIntentOpts,
	IntentResult,
	ToolCallRecord,
} from "./intent.js"

const INTENT_SYSTEM = `You are an intent classifier for a D&D 5e reference assistant.

Call the \`submit_lookups\` tool EXACTLY ONCE with the list of entries the user is asking about.
Each lookup is {category, query}:
- category MUST be one of the categories listed in this request.
- query MUST be the canonical English D&D name (e.g. "Fireball", "Wizard", "Goblin"), even if the user wrote it in another language or with typos. Example: user says "como funciona a magia bola de fogo" → {category: "spells", query: "Fireball"}.

Pass an EMPTY list when:
- The user is greeting/chatting without referring to any specific entry.
- The question is broad ("what spells exist?", "list monsters") — let the system fall back to full-category injection.
- You cannot confidently map the question to a canonical D&D name.

You MUST call \`submit_lookups\` even if the list is empty. Do not write any other prose.`

const lookupsSchema = z.object({
	lookups: z.array(
		z.object({
			category: categoryKeySchema,
			query: z.string().min(1),
		}),
	),
})

type LookupsArg = z.infer<typeof lookupsSchema>

function buildSubmitTool(): ToolSet {
	return {
		submit_lookups: tool({
			description: "Submit the list of D&D reference entries to look up for the user's question.",
			inputSchema: lookupsSchema,
			// No execute: we just want the args; the model isn't supposed to receive a result.
		}),
	} as ToolSet
}

function extractOpenRouterMeta(meta: unknown): { provider?: string; generationId?: string } {
	const m = meta as { openrouter?: { provider?: string; id?: string } } | undefined
	const out: { provider?: string; generationId?: string } = {}
	if (m?.openrouter?.provider) out.provider = m.openrouter.provider
	if (m?.openrouter?.id) out.generationId = m.openrouter.id
	return out
}

function extractLookupsFromResult(
	steps: ReadonlyArray<{ toolCalls?: ReadonlyArray<{ toolName: string; input: unknown }> }>,
): LookupsArg | null {
	for (const step of steps) {
		for (const tc of step.toolCalls ?? []) {
			if (tc.toolName !== "submit_lookups") continue
			const parsed = lookupsSchema.safeParse(tc.input)
			if (parsed.success) return parsed.data
		}
	}
	return null
}

function isValidCategory(set: Set<CategoryKey>, key: string): key is CategoryKey {
	return set.has(key as CategoryKey)
}

export async function identifyIntentV3(
	input: IdentifyIntentInput,
	opts: IdentifyIntentOpts = {},
): Promise<IntentResult> {
	const model = opts.model ?? intentModel()
	const modelId = DEFAULT_INTENT_MODEL_ID

	const userContext = `Available categories for this request: ${input.selectedCategories.join(", ")}

User message:
${input.userMessage}`

	logRequest({
		method: "v3/generateText+forcedTool",
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
			prompt: userContext,
			tools: buildSubmitTool(),
			toolChoice: { type: "tool", toolName: "submit_lookups" },
			stopWhen: stepCountIs(1),
			maxRetries: 0,
		})
	} catch (err) {
		logError({ method: "v3/generateText+forcedTool", model: modelId, err })
		throw err
	}
	const latencyMs = Date.now() - t0

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

	const lookups = extractLookupsFromResult(result.steps)
	const toolCalls: ToolCallRecord[] = []
	const matchedRenders: string[] = []

	if (lookups) {
		const selectedSet = new Set(input.selectedCategories)
		for (const { category, query } of lookups.lookups) {
			if (!isValidCategory(selectedSet, category)) continue
			const hits = lookupEntries(category, query)
			toolCalls.push({ category, query, matched: hits.map((h) => h.name) })
			for (const h of hits) matchedRenders.push(h.rendered)
		}
	}

	const usage = result.totalUsage ?? result.usage ?? { inputTokens: 0, outputTokens: 0 }
	const { provider, generationId } = extractOpenRouterMeta(result.providerMetadata)
	// modelo real servido (pode diferir do `modelId` quando o `models` fallback do OpenRouter rotou)
	const servedModel = result.response?.modelId ?? modelId

	logResponse({
		method: "v3/generateText+forcedTool",
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
