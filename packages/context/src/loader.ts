import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { z } from "zod"
import { type CategoryKey, registry } from "./registry.js"

const DATA_DIR = resolve(import.meta.dirname, "..", "data")

const cache = new Map<CategoryKey, unknown[]>()

export function loadCategory(key: CategoryKey): unknown[] {
	const cached = cache.get(key)
	if (cached) return cached

	const def = registry[key]
	const raw = readFileSync(resolve(DATA_DIR, def.file), "utf8")
	const parsed = JSON.parse(raw) as unknown
	const entries = z.array(def.schema).parse(parsed)
	cache.set(key, entries)
	return entries
}

export function loadAllCategories(): void {
	for (const key of Object.keys(registry) as CategoryKey[]) {
		loadCategory(key)
	}
}
