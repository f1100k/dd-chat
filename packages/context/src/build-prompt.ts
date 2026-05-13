import { loadCategory } from "./loader.js"
import { type CategoryKey, registry } from "./registry.js"
import { composeSystemPrompt } from "./system-prompt.js"

export interface BuildPromptInput {
	selectedCategories: CategoryKey[]
	userMessage: string
}

export interface BuildPromptOutput {
	systemPrompt: string
	injectedContext: string
}

export function buildPrompt(input: BuildPromptInput): BuildPromptOutput {
	const sections: string[] = []
	for (const key of input.selectedCategories) {
		const def = registry[key]
		const entries = loadCategory(key)
		const body = entries.map((e) => def.render(e)).join("\n\n")
		sections.push(`### ${key}\n${body}`)
	}
	const injectedContext = sections.join("\n\n")
	return {
		systemPrompt: composeSystemPrompt(injectedContext),
		injectedContext,
	}
}
