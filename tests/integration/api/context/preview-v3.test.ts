import { identifyIntentV3 } from "@dd-chat/api/context/intent-v3"
import { lookupEntries } from "@dd-chat/context"
import { contextPreviewV2ResponseSchema } from "@dd-chat/validators"
import { vi } from "vitest"
import { app } from "../../../helpers/app"
import { loginAndGetCookie } from "../../../helpers/auth"
import type { ApiError } from "../../../helpers/types"

vi.mock("@dd-chat/api/context/intent-v3", () => ({
	identifyIntentV3: vi.fn(),
}))

async function post(body: unknown, cookie?: string) {
	return app.request("/context/preview-v3", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(cookie ? { Cookie: cookie } : {}),
		},
		body: JSON.stringify(body),
	})
}

beforeEach(() => {
	vi.mocked(identifyIntentV3).mockReset()
})

describe("POST /context/preview-v3", () => {
	test("without cookie returns 401", async () => {
		const response = await post({ selectedCategories: [], userMessage: "" })
		expect(response.status).toBe(401)
		const body = (await response.json()) as ApiError
		expect(body.code).toBe("AUTHENTICATION_FAILED")
	})

	test("targeted mode: structured output retorna só as entries casadas", async () => {
		const { cookie } = await loginAndGetCookie()
		const fireball = lookupEntries("spells", "Fireball")

		vi.mocked(identifyIntentV3).mockResolvedValue({
			model: "mock/v3",
			toolCalls: [{ category: "spells", query: "Fireball", matched: ["Fireball"] }],
			matchedRenders: fireball.map((h) => h.rendered),
			inputTokens: 90,
			outputTokens: 25,
			latencyMs: 350,
		})

		const response = await post(
			{ selectedCategories: ["spells"], userMessage: "como funciona fireball?" },
			cookie,
		)
		expect(response.status).toBe(200)

		const parsed = contextPreviewV2ResponseSchema.strict().parse(await response.json())
		expect(parsed.mode).toBe("targeted")
		expect(parsed.injectedContext).toContain("Fireball")
		expect(parsed.injectedContext).not.toContain("Acid Arrow")
		expect(parsed.intent.inputTokens).toBe(90)
		expect(parsed.intent.outputTokens).toBe(25)
	})

	test("fallback-full quando o modelo devolve lista vazia", async () => {
		const { cookie } = await loginAndGetCookie()

		vi.mocked(identifyIntentV3).mockResolvedValue({
			model: "mock/v3",
			toolCalls: [],
			matchedRenders: [],
			inputTokens: 70,
			outputTokens: 3,
			latencyMs: 280,
		})

		const response = await post({ selectedCategories: ["spells"], userMessage: "oi" }, cookie)
		expect(response.status).toBe(200)

		const parsed = contextPreviewV2ResponseSchema.strict().parse(await response.json())
		expect(parsed.mode).toBe("fallback-full")
		expect(parsed.injectedContext.length).toBe(parsed.fullInjectionChars)
		expect(parsed.intent.toolCalls).toHaveLength(0)
	})

	test("targeted com múltiplas categorias", async () => {
		const { cookie } = await loginAndGetCookie()
		const fireball = lookupEntries("spells", "Fireball")
		const goblin = lookupEntries("monsters", "Goblin")

		vi.mocked(identifyIntentV3).mockResolvedValue({
			model: "mock/v3",
			toolCalls: [
				{ category: "spells", query: "Fireball", matched: ["Fireball"] },
				{ category: "monsters", query: "Goblin", matched: ["Goblin"] },
			],
			matchedRenders: [...fireball.map((h) => h.rendered), ...goblin.map((h) => h.rendered)],
			inputTokens: 130,
			outputTokens: 50,
			latencyMs: 600,
		})

		const response = await post(
			{
				selectedCategories: ["spells", "monsters"],
				userMessage: "fireball e goblin",
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

	test("400 com categoria inválida no body", async () => {
		const { cookie } = await loginAndGetCookie()
		const response = await post({ selectedCategories: ["nonexistent"], userMessage: "" }, cookie)
		expect(response.status).toBe(400)
	})
})
