import { createFileRoute, Outlet, useParams } from "@tanstack/react-router"

import { ConversationSidebar } from "@/components/conversation-sidebar"

export const Route = createFileRoute("/_authed/c")({
	component: ConversationLayout,
})

function ConversationLayout() {
	const { me, trpc } = Route.useRouteContext()
	// `id` só existe quando estamos em /c/$id; em /c puro, retorna undefined.
	const params = useParams({ strict: false })
	const activeId = (params as { id?: string }).id

	return (
		<div className='h-screen bg-bg text-fg flex overflow-hidden'>
			<ConversationSidebar me={me} trpc={trpc} activeId={activeId} />
			<main className='flex-1 min-w-0 flex flex-col bg-bg overflow-hidden'>
				<Outlet />
			</main>
		</div>
	)
}
