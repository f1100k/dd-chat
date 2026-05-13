import { contextPreviewResponseSchema } from "@dd-chat/validators"
import { app } from "../../../helpers/app"
import { loginAndGetCookie } from "../../../helpers/auth"
import type { ApiError, ZodErrorResponse } from "../../../helpers/types"

async function post(body: unknown, cookie?: string) {
	return app.request("/context/preview", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(cookie ? { Cookie: cookie } : {}),
		},
		body: JSON.stringify(body),
	})
}

describe("POST /context/preview", () => {
	test("without cookie returns 401", async () => {
		const response = await post({ selectedCategories: [], userMessage: "" })

		expect(response.status).toBe(401)

		const body = (await response.json()) as ApiError
		expect(body.code).toBe("AUTHENTICATION_FAILED")
	})

	test("with invalid category returns 400", async () => {
		const { cookie } = await loginAndGetCookie()

		const response = await post({ selectedCategories: ["nonexistent"], userMessage: "" }, cookie)

		expect(response.status).toBe(400)

		const body = (await response.json()) as ZodErrorResponse
		expect(body.issues).toBeDefined()
		expect(body.issues.length).toBeGreaterThan(0)
	})

	test("with empty selection returns systemPrompt and empty injectedContext", async () => {
		const { cookie } = await loginAndGetCookie()

		const response = await post({ selectedCategories: [], userMessage: "" }, cookie)

		expect(response.status).toBe(200)

		const parsed = contextPreviewResponseSchema.strict().parse(await response.json())
		expect(parsed.injectedContext).toBe("")
		expect(parsed.systemPrompt).toContain("Dungeons & Dragons")
		// orientação para quando não há categoria selecionada
		expect(parsed.systemPrompt).toContain("nenhuma categoria selecionada")
	})

	test("with ['spells'] selected returns spell entries rendered", async () => {
		const { cookie } = await loginAndGetCookie()

		const response = await post(
			{ selectedCategories: ["spells"], userMessage: "como funciona fireball?" },
			cookie,
		)

		expect(response.status).toBe(200)

		const parsed = contextPreviewResponseSchema.strict().parse(await response.json())
		expect(parsed.injectedContext).toContain("### spells")
		// formato compacto: "Name [lvl school | cast | ...]"
		expect(parsed.injectedContext).toMatch(/Fireball \[3 evocation \|/)
		expect(parsed.injectedContext).toMatch(/Acid Arrow \[2 evocation \|/)
		// systemPrompt embute o injectedContext
		expect(parsed.systemPrompt).toContain(parsed.injectedContext)
	})

	test("with multiple categories returns each section in order", async () => {
		const { cookie } = await loginAndGetCookie()

		const response = await post(
			{ selectedCategories: ["abilities", "combat"], userMessage: "" },
			cookie,
		)

		expect(response.status).toBe(200)

		const parsed = contextPreviewResponseSchema.strict().parse(await response.json())
		const abilitiesIdx = parsed.injectedContext.indexOf("### abilities")
		const combatIdx = parsed.injectedContext.indexOf("### combat")
		expect(abilitiesIdx).toBeGreaterThanOrEqual(0)
		expect(combatIdx).toBeGreaterThan(abilitiesIdx)
		// regras gerais do PHB estão na categoria combat
		expect(parsed.injectedContext).toContain("## Actions in Combat")
	})

	test("userMessage is optional (defaults to empty string)", async () => {
		const { cookie } = await loginAndGetCookie()

		const response = await post({ selectedCategories: [] }, cookie)

		expect(response.status).toBe(200)

		const parsed = contextPreviewResponseSchema.strict().parse(await response.json())
		expect(parsed.injectedContext).toBe("")
	})
})
