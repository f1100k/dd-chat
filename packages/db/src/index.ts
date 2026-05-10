import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

declare global {
	var __prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const prisma =
	globalThis.__prisma ??
	new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	})

if (process.env.NODE_ENV !== "production") {
	globalThis.__prisma = prisma
}

export * from "@prisma/client"
