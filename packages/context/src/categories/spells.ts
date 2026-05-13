import { z } from "zod"

export const spellSchema = z.object({
	name: z.string().min(1),
	level: z.number().int().min(0).max(9),
	school: z.string().min(1),
	castingTime: z.string().min(1),
	range: z.string().min(1),
	components: z.array(z.enum(["V", "S", "M"])).min(1),
	material: z.string().nullable(),
	duration: z.string().min(1),
	concentration: z.boolean(),
	ritual: z.boolean(),
	description: z.string().min(1),
	higherLevel: z.string().nullable(),
	classes: z.array(z.string().min(1)).min(1),
})

export type Spell = z.infer<typeof spellSchema>

const CAST_ABBR: Record<string, string> = {
	"1 action": "1a",
	"1 bonus action": "1ba",
	"1 reaction": "1r",
}

const DURATION_ABBR: Record<string, string> = {
	Instantaneous: "Instant",
}

function compact(value: string, table: Record<string, string>): string {
	return table[value] ?? value
}

export function renderSpell(s: Spell): string {
	const flags = [
		`${s.level} ${s.school.toLowerCase()}`,
		s.ritual ? "ritual" : null,
		s.concentration ? "conc" : null,
	]
		.filter(Boolean)
		.join(" ")

	const components = s.material ? `${s.components.join("")}(${s.material})` : s.components.join("")

	const head = `${s.name} [${flags} | ${compact(s.castingTime, CAST_ABBR)} | ${s.range} | ${compact(s.duration, DURATION_ABBR)} | ${components} | ${s.classes.join(",")}]`

	const lines = [head, s.description]
	if (s.higherLevel) lines.push(`^ ${s.higherLevel}`)
	return lines.join("\n")
}
