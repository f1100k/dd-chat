import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"

import { AIMessage } from "@/components/chat/ai-message"
import { ChatInput } from "@/components/chat/chat-input"
import { UserMessage } from "@/components/chat/user-message"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authed/c/$id")({
	component: ConversationPage,
})

function ConversationPage() {
	const { id } = Route.useParams()
	const { me, trpc } = Route.useRouteContext()
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const conv = useQuery(trpc.conversation.byId.queryOptions({ id }))
	const messages = useQuery(trpc.message.list.queryOptions({ conversationId: id }))

	const del = useMutation(
		trpc.conversation.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: trpc.conversation.list.queryKey() })
				navigate({ to: "/c" })
			},
		}),
	)

	if (conv.isLoading) {
		return (
			<div className='flex-1 grid place-items-center text-fg-muted'>
				<Loader2 size={18} className='animate-spin' />
			</div>
		)
	}

	if (conv.isError) {
		return (
			<div className='flex-1 grid place-items-center text-danger'>
				<p>Conversa não encontrada ou sem acesso.</p>
			</div>
		)
	}

	const title = conv.data?.title ?? "(sem título)"
	const msgs = messages.data ?? []

	return (
		<>
			<ChatHeader
				title={title}
				onDelete={() => {
					if (confirm("Excluir esta conversa?")) del.mutate({ id })
				}}
				deleting={del.isPending}
			/>

			<div className='flex-1 overflow-y-auto'>
				<div className='max-w-[760px] mx-auto px-8 pt-2 pb-6'>
					{messages.isLoading ? (
						<div className='py-10 text-center text-fg-muted text-[13px]'>Carregando mensagens…</div>
					) : msgs.length === 0 ? (
						<EmptyConversation />
					) : (
						msgs.map((m) =>
							m.role === "USER" ? (
								<UserMessage
									key={m.id}
									content={m.content}
									chips={m.selectedCategories ?? []}
									injectedContext={m.injectedContext}
									authorInitials={initials(me.displayName)}
									createdAt={m.createdAt}
								/>
							) : (
								<AIMessage key={m.id} content={m.content} state='done' createdAt={m.createdAt} />
							),
						)
					)}
				</div>
			</div>

			<div className='p-2 pb-5'>
				<div className='max-w-[760px] mx-auto px-8'>
					<ChatInput placeholder='Pergunte algo sobre D&D… ou digite / para escolher contexto' />
				</div>
			</div>
		</>
	)
}

function initials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "?"
	if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "?"
	return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase()
}

function ChatHeader({
	title,
	onDelete,
	deleting,
}: {
	title: string
	onDelete: () => void
	deleting: boolean
}) {
	const [menuOpen, setMenuOpen] = useState(false)
	return (
		<div className='h-13 px-5 flex items-center gap-3 border-b border-border-soft relative'>
			<div className='text-[13.5px] font-medium tracking-[-0.005em] truncate'>{title}</div>
			<div className='flex-1' />
			<Button
				variant='ghost'
				size='sm'
				className='h-7 px-2 text-fg-muted'
				onClick={() => setMenuOpen((v) => !v)}
			>
				<MoreHorizontal size={15} />
			</Button>
			{menuOpen ? (
				<div className='absolute right-3 top-12 z-10 w-44 rounded-[8px] border border-border bg-bg-elev shadow-[var(--shadow-pop)] p-1'>
					<button
						type='button'
						onClick={() => {
							setMenuOpen(false)
							onDelete()
						}}
						disabled={deleting}
						className='w-full px-3 py-2 rounded-[6px] flex items-center gap-2 text-[12.5px] text-danger hover:bg-danger-soft cursor-pointer disabled:opacity-50'
					>
						<Trash2 size={13} />
						{deleting ? "Excluindo…" : "Excluir conversa"}
					</button>
				</div>
			) : null}
		</div>
	)
}

function EmptyConversation() {
	return (
		<div className='py-12 text-center'>
			<p className='text-[14px] text-fg-2 font-medium mb-1'>Sem mensagens ainda.</p>
			<p className='text-[12.5px] text-fg-muted'>
				O chat com LLM entra no M6. Por enquanto, só o esqueleto da conversa.
			</p>
		</div>
	)
}
