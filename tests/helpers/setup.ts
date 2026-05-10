import { prisma } from "@dd-chat/db"

beforeEach(async () => {
	const tables = await prisma.$queryRaw<{ table_name: string }[]>`
		SELECT table_name
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name != '_prisma_migrations'
	`

	if (tables.length === 0) return

	const tableList = tables.map(({ table_name }) => `"${table_name}"`).join(", ")
	await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`)
})

afterAll(async () => {
	await prisma.$disconnect()
})
