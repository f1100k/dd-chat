import { loadCategory } from "./loader.js"
import { type CategoryKey, registry } from "./registry.js"

function normalize(s: string): string {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim()
}

function getName(entry: unknown): string {
	if (typeof entry === "object" && entry !== null && "name" in entry) {
		const n = (entry as { name: unknown }).name
		if (typeof n === "string") return n
	}
	return ""
}

export interface LookupHit {
	name: string
	rendered: string
}

/**
 * Fuzzy-match entries in a category by name. Returns rendered (compact) strings
 * for the matched entries. Matching is case-insensitive and uses token-level
 * substring overlap so "fire ball", "FIREBALL", "Fireball" all match "Fireball".
 */
export function lookupEntries(category: CategoryKey, query: string): LookupHit[] {
	const def = registry[category]
	const entries = loadCategory(category)
	const q = normalize(query)
	if (!q) return []

	const qTokens = q.split(" ").filter(Boolean)

	const hits: LookupHit[] = []
	for (const entry of entries) {
		const name = getName(entry)
		if (!name) continue
		const nName = normalize(name)
		if (!nName) continue

		const exact = nName === q
		const substring = nName.includes(q) || q.includes(nName)
		const allTokensMatch = qTokens.every((t) => nName.includes(t))

		if (exact || substring || (qTokens.length > 0 && allTokensMatch)) {
			hits.push({ name, rendered: def.render(entry) })
		}
	}
	return hits
}
