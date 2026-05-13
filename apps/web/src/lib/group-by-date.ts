const DAY_MS = 24 * 60 * 60 * 1000

export type DateGroupKey = "today" | "yesterday" | "week" | "older"

export interface DateGroupSpec {
	key: DateGroupKey
	label: string
}

export const DATE_GROUP_ORDER: DateGroupSpec[] = [
	{ key: "today", label: "Hoje" },
	{ key: "yesterday", label: "Ontem" },
	{ key: "week", label: "7 dias" },
	{ key: "older", label: "Mais antigas" },
]

function startOfDay(d: Date): number {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

export function classifyDate(d: Date, now: Date = new Date()): DateGroupKey {
	const diffDays = Math.floor((startOfDay(now) - startOfDay(d)) / DAY_MS)
	if (diffDays <= 0) return "today"
	if (diffDays === 1) return "yesterday"
	if (diffDays <= 7) return "week"
	return "older"
}

export function relativeTime(d: Date, now: Date = new Date()): string {
	const diffMs = now.getTime() - d.getTime()
	const diffMin = Math.floor(diffMs / 60_000)
	if (diffMin < 1) return "agora"
	if (diffMin < 60) return `há ${diffMin} min`
	const diffH = Math.floor(diffMin / 60)
	if (diffH < 24) return `há ${diffH}h`
	const diffD = Math.floor(diffH / 24)
	if (diffD === 1) return "ontem"
	if (diffD < 7) return `${diffD} dias`
	return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

export function groupByDate<T extends { createdAt: Date | string }>(
	items: T[],
): Array<{
	spec: DateGroupSpec
	items: T[]
}> {
	const now = new Date()
	const buckets: Record<DateGroupKey, T[]> = {
		today: [],
		yesterday: [],
		week: [],
		older: [],
	}
	for (const item of items) {
		const d = item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt)
		buckets[classifyDate(d, now)].push(item)
	}
	return DATE_GROUP_ORDER.filter((g) => buckets[g.key].length > 0).map((spec) => ({
		spec,
		items: buckets[spec.key],
	}))
}
