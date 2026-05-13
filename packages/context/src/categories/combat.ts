import { z } from "zod"

export const combatConditionSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
})

export type CombatCondition = z.infer<typeof combatConditionSchema>

const CONDITION_BOILERPLATE =
	/^While you have the [A-Za-z]+ condition, you experience the following effects\.\s*\n?/

const VARIANT_SUBSECTION = /\n#{2,4} Variant: [^\n]+\n[\s\S]*?(?=\n#{2,4} |\n*$)/g

export function renderCombatCondition(c: CombatCondition): string {
	let body = c.description.replace(CONDITION_BOILERPLATE, "")
	body = body.replace(VARIANT_SUBSECTION, "")
	return `## ${c.name}\n${body}`
}
