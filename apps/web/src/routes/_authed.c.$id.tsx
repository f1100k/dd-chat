import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/c/$id")({
	component: ConversationPage,
})

function ConversationPage() {
	const { id } = Route.useParams()
	return (
		<div className='min-h-screen grid place-items-center text-fg-muted'>
			<p>
				Conversa <span className='font-mono text-fg-2'>{id}</span> — placeholder.
			</p>
		</div>
	)
}
