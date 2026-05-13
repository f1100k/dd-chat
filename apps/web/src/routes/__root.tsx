import type { UserPublic } from "@dd-chat/validators"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import type { Trpc } from "@/lib/trpc"

export interface RouterContext {
	queryClient: QueryClient
	loadMe: () => Promise<UserPublic | null>
	trpc: Trpc
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<Outlet />
			{import.meta.env.DEV ? <TanStackRouterDevtools position='bottom-right' /> : null}
		</>
	)
}
