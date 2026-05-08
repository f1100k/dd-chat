import { resolve } from "node:path"
import { config } from "dotenv"
import { defineConfig } from "vitest/config"

config({ path: resolve(__dirname, "../.env") })

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["integration/**/*.test.ts"],
		setupFiles: ["./helpers/setup.ts"],
		fileParallelism: false,
		pool: "forks",
	},
})
