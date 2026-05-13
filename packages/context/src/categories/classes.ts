import { z } from "zod"

export const classSchema = z.object({
	name: z.string().min(1),
	hitDie: z.number().int(),
	primaryAbility: z.string().min(1),
	savingThrows: z.array(z.string()),
	skillChoice: z.string(),
	proficiencies: z.array(z.string()),
})

export type DnDClass = z.infer<typeof classSchema>

export function renderClass(c: DnDClass): string {
	const head = `${c.name} [d${c.hitDie} | ${c.primaryAbility} | saves: ${c.savingThrows.join(",")}]`
	const lines = [head]
	if (c.skillChoice) lines.push(`skills: ${c.skillChoice}`)
	if (c.proficiencies.length) lines.push(`profs: ${c.proficiencies.join(", ")}`)
	return lines.join("\n")
}
