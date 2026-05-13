import { APICallError, RetryError } from "ai"

// ANSI cores. Forçar via `LLM_LOG_NO_COLOR=1` se incomodar.
const NO_COLOR = process.env.LLM_LOG_NO_COLOR === "1"
const C = {
	reset: NO_COLOR ? "" : "\x1b[0m",
	bold: NO_COLOR ? "" : "\x1b[1m",
	dim: NO_COLOR ? "" : "\x1b[2m",
	cyan: NO_COLOR ? "" : "\x1b[36m",
	green: NO_COLOR ? "" : "\x1b[32m",
	red: NO_COLOR ? "" : "\x1b[31m",
	yellow: NO_COLOR ? "" : "\x1b[33m",
	magenta: NO_COLOR ? "" : "\x1b[35m",
}

// Banner único no boot pra confirmar que o módulo de logging carregou.
console.log(`${C.magenta}${C.bold}━━━ LLM logging ativo (intent.ts / intent-v3.ts) ━━━${C.reset}`)

export interface LLMRequestLog {
	method: string
	model: string
	fallbacks?: string[]
	prompt: string
}

export interface LLMResponseLog {
	method: string
	model: string
	provider?: string | undefined
	generationId?: string | undefined
	inputTokens: number
	outputTokens: number
	latencyMs: number
	finishReason?: string | undefined
}

function tag(color: string, text: string): string {
	return `${color}${C.bold}${text}${C.reset}`
}

export function logRequest(opts: LLMRequestLog): void {
	const fb =
		opts.fallbacks && opts.fallbacks.length > 1
			? `\n  ${C.dim}fallbacks=[${opts.fallbacks.join(", ")}]${C.reset}`
			: ""
	console.log(
		`\n${tag(C.cyan, "[LLM →]")} ${C.bold}${opts.method}${C.reset} model=${opts.model} prompt_chars=${opts.prompt.length}${fb}`,
	)
}

export function logResponse(opts: LLMResponseLog): void {
	const provider = opts.provider ? ` ${C.green}provider=${opts.provider}${C.reset}` : ""
	const gen = opts.generationId ? ` ${C.dim}gen=${opts.generationId}${C.reset}` : ""
	const finish = opts.finishReason ? ` finish=${opts.finishReason}` : ""
	console.log(
		`${tag(C.green, "[LLM ←]")} ${C.bold}${opts.method}${C.reset} model=${opts.model}${provider}${gen} ${C.bold}in=${opts.inputTokens} out=${opts.outputTokens}${C.reset} ${opts.latencyMs}ms${finish}`,
	)
}

interface OpenRouterErrorData {
	error?: {
		message?: string
		code?: number
		metadata?: {
			provider_name?: string
			raw?: string
			retry_after_seconds?: number
		}
	}
}

function dumpApiCallError(err: APICallError, indent = "  "): void {
	const status = err.statusCode ?? "?"
	const data = err.data as OpenRouterErrorData | undefined
	const provider = data?.error?.metadata?.provider_name ?? "?"
	const retryAfter = data?.error?.metadata?.retry_after_seconds
	const upstreamMsg = data?.error?.message ?? err.message

	console.error(
		`${indent}${C.red}status=${status}${C.reset} ${C.yellow}provider=${provider}${C.reset}`,
	)
	console.error(`${indent}msg=${upstreamMsg}`)
	if (retryAfter !== undefined) console.error(`${indent}retry_after=${retryAfter}s`)

	// Dump COMPLETO do responseBody — o que o user pediu pra ver.
	if (err.responseBody) {
		console.error(`${indent}${C.dim}responseBody:${C.reset}`)
		try {
			const parsed = JSON.parse(err.responseBody) as unknown
			console.error(`${indent}${JSON.stringify(parsed, null, 2).split("\n").join(`\n${indent}`)}`)
		} catch {
			console.error(`${indent}${err.responseBody}`)
		}
	}

	// Headers úteis pra debug (rate-limit, request id)
	if (err.responseHeaders) {
		const interesting: Record<string, string> = {}
		for (const [k, v] of Object.entries(err.responseHeaders)) {
			if (/^(retry-after|x-ratelimit|x-request-id|x-or-|cf-ray)/i.test(k)) {
				interesting[k] = v
			}
		}
		if (Object.keys(interesting).length > 0) {
			console.error(`${indent}${C.dim}headers (subset):${C.reset}`)
			for (const [k, v] of Object.entries(interesting)) {
				console.error(`${indent}  ${k}: ${v}`)
			}
		}
	}
}

export function logError(opts: { method: string; model: string; err: unknown }): void {
	const head = `\n${tag(C.red, "[LLM ✗]")} ${C.bold}${opts.method}${C.reset} model=${opts.model}`

	if (APICallError.isInstance(opts.err)) {
		console.error(head)
		dumpApiCallError(opts.err)
		return
	}

	if (RetryError.isInstance(opts.err)) {
		const attempts = opts.err.errors.length
		console.error(`${head} ${C.yellow}retries=${attempts}${C.reset}`)
		opts.err.errors.forEach((inner, i) => {
			console.error(`  ${C.bold}attempt ${i + 1}/${attempts}:${C.reset}`)
			if (APICallError.isInstance(inner)) {
				dumpApiCallError(inner, "    ")
			} else {
				console.error(`    ${String(inner)}`)
			}
		})
		return
	}

	console.error(head)
	console.error(opts.err)
}
