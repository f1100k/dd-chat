import { z } from "zod"

export const itemSchema = z.object({
	name: z.string().min(1),
	category: z.string().min(1),
	rarity: z.string().min(1),
	attunement: z.boolean(),
	description: z.string().min(1),
})

export type Item = z.infer<typeof itemSchema>

export function renderItem(i: Item): string {
	const attune = i.attunement ? "attune" : "no-attune"
	return `${i.name} [${i.category}, ${i.rarity}, ${attune}]\n${i.description}`
}
