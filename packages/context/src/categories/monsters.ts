import { z } from "zod"

const namedDescSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
})

export const monsterSchema = z.object({
	name: z.string().min(1),
	size: z.string().min(1),
	type: z.string().min(1),
	alignment: z.string().min(1),
	armorClass: z.number().int(),
	hitPoints: z.number().int(),
	hitDice: z.string(),
	speed: z.string(),
	abilities: z.object({
		str: z.number().int(),
		dex: z.number().int(),
		con: z.number().int(),
		int: z.number().int(),
		wis: z.number().int(),
		cha: z.number().int(),
	}),
	challengeRating: z.number(),
	specialAbilities: z.array(namedDescSchema),
	actions: z.array(namedDescSchema),
})

export type Monster = z.infer<typeof monsterSchema>

function formatCR(cr: number): string {
	if (cr === 0.125) return "1/8"
	if (cr === 0.25) return "1/4"
	if (cr === 0.5) return "1/2"
	return String(cr)
}

function renderNamedList(items: ReadonlyArray<{ name: string; description: string }>): string {
	return items.map((it) => `- ${it.name}: ${it.description}`).join("\n")
}

export function renderMonster(m: Monster): string {
	const a = m.abilities
	const stats = `${a.str} ${a.dex} ${a.con} ${a.int} ${a.wis} ${a.cha}`
	const speed = m.speed.replace(/\s+/g, " ")
	const head = `${m.name} [${m.size} ${m.type}, ${m.alignment} | AC ${m.armorClass}, HP ${m.hitPoints}(${m.hitDice}) | ${speed} | ${stats} | CR ${formatCR(m.challengeRating)}]`

	const lines = [head]
	if (m.specialAbilities.length) {
		lines.push(`traits:\n${renderNamedList(m.specialAbilities)}`)
	}
	if (m.actions.length) {
		lines.push(`actions:\n${renderNamedList(m.actions)}`)
	}
	return lines.join("\n")
}
