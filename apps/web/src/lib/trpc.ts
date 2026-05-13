import type { AppRouter } from "@dd-chat/trpc"
import type { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink, type TRPCClient } from "@trpc/client"
import { createTRPCOptionsProxy, type TRPCOptionsProxy } from "@trpc/tanstack-react-query"

export const trpcClient: TRPCClient<AppRouter> = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/trpc",
			fetch: (url, options) => fetch(url, { ...(options as RequestInit), credentials: "include" }),
		}),
	],
})

export type Trpc = TRPCOptionsProxy<AppRouter>

export function createTrpc(queryClient: QueryClient): Trpc {
	return createTRPCOptionsProxy<AppRouter>({
		client: trpcClient,
		queryClient,
	})
}
