import type { z } from "zod"
import { abilitySchema, renderAbility } from "./categories/abilities.js"
import { classSchema, renderClass } from "./categories/classes.js"
import { combatConditionSchema, renderCombatCondition } from "./categories/combat.js"
import { itemSchema, renderItem } from "./categories/items.js"
import { monsterSchema, renderMonster } from "./categories/monsters.js"
import { renderSpell, spellSchema } from "./categories/spells.js"

export type CategoryDef = {
	schema: z.ZodType
	render: (entry: unknown) => string
	file: string
}

function defineCategory<T>(def: {
	schema: z.ZodType<T>
	render: (entry: T) => string
	file: string
}): CategoryDef {
	return def as CategoryDef
}

export const registry = {
	spells: defineCategory({
		schema: spellSchema,
		render: renderSpell,
		file: "spells.json",
	}),
	monsters: defineCategory({
		schema: monsterSchema,
		render: renderMonster,
		file: "monsters.json",
	}),
	classes: defineCategory({
		schema: classSchema,
		render: renderClass,
		file: "classes.json",
	}),
	items: defineCategory({
		schema: itemSchema,
		render: renderItem,
		file: "items.json",
	}),
	combat: defineCategory({
		schema: combatConditionSchema,
		render: renderCombatCondition,
		file: "combat.json",
	}),
	abilities: defineCategory({
		schema: abilitySchema,
		render: renderAbility,
		file: "abilities.json",
	}),
} as const

export type CategoryKey = keyof typeof registry
