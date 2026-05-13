import { loadAllCategories } from "@dd-chat/context"
import { serve } from "@hono/node-server"
import app from "./app.js"
// Import por side-effect pra garantir que o banner do LLM logging apareça no boot
import "./llm/logging.js"

loadAllCategories()

serve(
	{
		fetch: app.fetch,
		port: Number(process.env.PORT) || 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`)
	},
)
