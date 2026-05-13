import { z } from "zod"

export const abilitySchema = z.object({
	name: z.string().min(1),
	shortName: z.string().min(1),
	description: z.string().min(1),
	skills: z.array(z.string()),
})

export type Ability = z.infer<typeof abilitySchema>

export function renderAbility(a: Ability): string {
	const skills = a.skills.length ? ` skills: ${a.skills.join(",")}` : ""
	return `${a.shortName} (${a.name}) — ${a.description}.${skills}`
}
