import { identifyIntent } from "@dd-chat/api/context/intent"
import { lookupEntries } from "@dd-chat/context"
import { contextPreviewV2ResponseSchema } from "@dd-chat/validators"
import { vi } from "vitest"
import { app } from "../../../helpers/app"
import { loginAndGetCookie } from "../../../helpers/auth"
import type { ApiError } from "../../../helpers/types"

vi.mock("@dd-chat/api/context/intent", () => ({
	identifyIntent: vi.fn(),
}))

async function post(body: unknown, cookie?: string) {
	return app.request("/context/preview-v2", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(cookie ? { Cookie: cookie } : {}),
		},
		body: JSON.stringify(body),
	})
}

beforeEach(() => {
	vi.mocked(identifyIntent).mockReset()
})

describe("POST /context/preview-v2", () => {
	test("without cookie returns 401", async () => {
		const response = await post({ selectedCategories: [], userMessage: "" })
		expect(response.status).toBe(401)
		const body = (await response.json()) as ApiError
		expect(body.code).toBe("AUTHENTICATION_FAILED")
	})

	test("targeted mode: returns only matched entries when lookup hits", async () => {
		const { cookie } = await loginAndGetCookie()

		// Simula o LLM chamando lookup_spells("Fireball"). Backend (no real intent.ts)
		// chamaria lookupEntries — aqui simulo a saída diretamente.
		const fireballHits = lookupEntries("spells", "Fireball")
		expect(fireballHits.length).toBeGreaterThan(0)

		vi.mocked(identifyIntent).mockResolvedValue({
			model: "mock/intent",
			toolCalls: [{ category: "spells", query: "Fireball", matched: ["Fireball"] }],
			matchedRenders: fireballHits.map((h) => h.rendered),
			inputTokens: 120,
			outputTokens: 25,
			latencyMs: 410,
		})

		const response = await post(
			{ selectedCategories: ["spells"], userMessage: "como funciona fireball?" },
			cookie,
		)
		expect(response.status).toBe(200)

		const parsed = contextPreviewV2ResponseSchema.strict().parse(await response.json())
		expect(parsed.mode).toBe("targeted")
		expect(parsed.injectedContext).toContain("Fireball")
		// não contém outros spells que não foram alvo
		expect(parsed.injectedContext).not.toContain("Acid Arrow")
		// injectedContext é menor que o full-context (sinal de economia)
		expect(parsed.injectedContext.length).toBeLessThan(parsed.fullInjectionChars)
		expect(parsed.intent.toolCalls).toHaveLength(1)
		expect(parsed.intent.toolCalls[0]?.category).toBe("spells")
		expect(parsed.intent.toolCalls[0]?.matched).toContain("Fireball")
		expect(parsed.intent.inputTokens).toBe(120)
		expect(parsed.intent.outputTokens).toBe(25)
	})

	test("fallback-full mode: returns full context when no tools matched", async () => {
		const { cookie } = await loginAndGetCookie()

		vi.mocked(identifyIntent).mockResolvedValue({
			model: "mock/intent",
			toolCalls: [],
			matchedRenders: [],
			inputTokens: 80,
			outputTokens: 5,
			latencyMs: 320,
		})

		const response = await post(
			{ selectedCategories: ["spells"], userMessage: "oi tudo bem?" },
			cookie,
		)
		expect(response.status).toBe(200)

		const parsed = contextPreviewV2ResponseSchema.strict().parse(await response.json())
		expect(parsed.mode).toBe("fallback-full")
		expect(parsed.injectedContext.length).toBe(parsed.fullInjectionChars)
		expect(parsed.injectedContext).toContain("### spells")
		// no fallback, toolCalls vazio + metadata do intent continua presente
		expect(parsed.intent.toolCalls).toHaveLength(0)
		expect(parsed.intent.inputTokens).toBe(80)
	})

	test("targeted mode with multiple categories merges all matched renders", async () => {
		const { cookie } = await loginAndGetCookie()

		const fireball = lookupEntries("spells", "Fireball")
		const goblin = lookupEntries("monsters", "Goblin")

		vi.mocked(identifyIntent).mockResolvedValue({
			model: "mock/intent",
			toolCalls: [
				{ category: "spells", query: "Fireball", matched: ["Fireball"] },
				{ category: "monsters", query: "Goblin", matched: ["Goblin"] },
			],
			matchedRenders: [...fireball.map((h) => h.rendered), ...goblin.map((h) => h.rendered)],
			inputTokens: 200,
			outputTokens: 60,
			latencyMs: 800,
		})

		const response = await post(
			{
				selectedCategories: ["spells", "monsters"],
				userMessage: "como funciona fireball e o goblin?",
			},
			cookie,
		)
		expect(response.status).toBe(200)

		const parsed = contextPreviewV2ResponseSchema.strict().parse(await response.json())
		expect(parsed.mode).toBe("targeted")
		expect(parsed.injectedContext).toContain("Fireball")
		expect(parsed.injectedContext).toContain("Goblin")
		expect(parsed.intent.toolCalls).toHaveLength(2)
	})

	test("400 when body has invalid category", async () => {
		const { cookie } = await loginAndGetCookie()
		const response = await post({ selectedCategories: ["nonexistent"], userMessage: "" }, cookie)
		expect(response.status).toBe(400)
	})
})

describe("lookupEntries (helper used by tools)", () => {
	test("matches by exact canonical name", () => {
		expect(lookupEntries("spells", "Fireball").map((h) => h.name)).toEqual(["Fireball"])
	})

	test("matches case-insensitively", () => {
		expect(lookupEntries("spells", "fireball").map((h) => h.name)).toEqual(["Fireball"])
	})

	test("matches with token-level overlap (handles whitespace mismatches)", () => {
		// "fire ball" tokens são "fire" + "ball", ambos substrings de "fireball"
		expect(lookupEntries("spells", "fire ball").map((h) => h.name)).toEqual(["Fireball"])
		expect(lookupEntries("spells", "FIREBALL").map((h) => h.name)).toEqual(["Fireball"])
	})

	test("returns empty when nothing matches", () => {
		// queries em outro idioma não casam sem dicionário; fica pro LLM resolver a tradução
		expect(lookupEntries("spells", "bola de fogo")).toEqual([])
		expect(lookupEntries("spells", "")).toEqual([])
		expect(lookupEntries("spells", "totally unknown spell")).toEqual([])
	})
})
