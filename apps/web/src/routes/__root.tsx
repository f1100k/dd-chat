import type { UserPublic } from "@dd-chat/validators"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export interface RouterContext {
	queryClient: QueryClient
	loadMe: () => Promise<UserPublic | null>
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
