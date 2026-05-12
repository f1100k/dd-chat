import type { UserPublic } from "@dd-chat/validators"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ApiError, api } from "@/lib/api"
import { routeTree } from "@/routeTree.gen"
import "@/styles/globals.css"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 60_000, retry: false, refetchOnWindowFocus: false },
	},
})

async function loadMe(): Promise<UserPublic | null> {
	return queryClient.fetchQuery({
		queryKey: ["me"],
		queryFn: async () => {
			try {
				return await api.get<UserPublic>("/auth/me")
			} catch (err) {
				if (err instanceof ApiError && err.status === 401) return null
				throw err
			}
		},
	})
}

const router = createRouter({
	routeTree,
	context: { queryClient, loadMe },
	defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const rootEl = document.getElementById("root")
if (!rootEl) throw new Error("Root element #root not found")

createRoot(rootEl).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
)
