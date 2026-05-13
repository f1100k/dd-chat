import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { LogOut, Plus, Search } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useLogout } from "@/lib/auth"
import { groupByDate, relativeTime } from "@/lib/group-by-date"
import type { Trpc } from "@/lib/trpc"

interface User {
	id: string
	email: string
	displayName: string
}

export function ConversationSidebar({
	me,
	trpc,
	activeId,
}: {
	me: User
	trpc: Trpc
	activeId?: string | undefined
}) {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const logout = useLogout()

	const list = useQuery(trpc.conversation.list.queryOptions())
	const create = useMutation(
		trpc.conversation.create.mutationOptions({
			onSuccess: (conv) => {
				queryClient.invalidateQueries({ queryKey: trpc.conversation.list.queryKey() })
				// Pré-popula as queries da página de destino pra evitar flash do spinner.
				queryClient.setQueryData(trpc.conversation.byId.queryKey({ id: conv.id }), conv)
				queryClient.setQueryData(trpc.message.list.queryKey({ conversationId: conv.id }), [])
				navigate({ to: "/c/$id", params: { id: conv.id } })
			},
		}),
	)

	const onNewConversation = () => create.mutate({})

	// Keyboard shortcut ⌘N / Ctrl+N
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
				e.preventDefault()
				if (!create.isPending) create.mutate({})
			}
		}
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [create])

	// Hidrata o cache do `byId` com os dados que já vieram de `list`. Evita o
	// flash de spinner quando o user clica numa conversa do sidebar.
	useEffect(() => {
		if (!list.data) return
		for (const conv of list.data) {
			queryClient.setQueryData(trpc.conversation.byId.queryKey({ id: conv.id }), conv)
		}
	}, [list.data, queryClient, trpc])

	const onLogout = async () => {
		await logout.mutateAsync()
		await navigate({ to: "/login" })
	}

	const groups = list.data
		? groupByDate(list.data.map((c) => ({ ...c, createdAt: new Date(c.updatedAt) })))
		: []

	return (
		<aside className='w-[264px] h-full bg-bg-elev border-r border-border flex flex-col flex-shrink-0'>
			<div className='h-13 px-4 flex items-center gap-2.5 border-b border-border-soft'>
				<div className='w-[22px] h-[22px] bg-accent text-accent-fg grid place-items-center rounded-[5px] font-mono font-bold text-[11px]'>
					d20
				</div>
				<div className='font-semibold text-[13.5px] tracking-[-0.01em]'>D&D Chat</div>
			</div>

			<div className='p-2.5'>
				<button
					type='button'
					onClick={onNewConversation}
					disabled={create.isPending}
					className='w-full h-8.5 px-3 flex items-center gap-1.5 rounded-[6px] border border-border bg-surface-2 text-fg text-[13px] hover:bg-surface disabled:opacity-50 cursor-pointer'
				>
					<Plus size={14} className='text-fg-2' />
					<span>{create.isPending ? "Criando…" : "Nova conversa"}</span>
					<span className='kbd ml-auto'>⌘N</span>
				</button>
			</div>

			<div className='px-2.5 pb-1.5'>
				<div className='h-[30px] px-2.5 bg-bg border border-border-soft rounded-[6px] flex items-center gap-2 text-fg-faint text-[12.5px]'>
					<Search size={13} className='text-fg-muted' />
					<span>Buscar conversa</span>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto relative'>
				{list.isLoading ? (
					<div className='p-4.5 text-fg-muted text-[12.5px]'>Carregando…</div>
				) : list.isError ? (
					<div className='p-4.5 text-danger text-[12.5px]'>Erro: {list.error?.message}</div>
				) : list.data?.length === 0 ? (
					<EmptySidebar />
				) : (
					groups.map(({ spec, items }) => (
						<div key={spec.key} className='px-2 pt-2.5'>
							<div className='px-2 pt-1 pb-1.5 text-[10.5px] text-fg-faint font-semibold tracking-[0.06em] uppercase'>
								{spec.label}
							</div>
							<div className='flex flex-col gap-0.5'>
								{items.map((c) => (
									<SidebarItem
										key={c.id}
										id={c.id}
										title={c.title ?? "(sem título)"}
										time={relativeTime(new Date(c.updatedAt))}
										active={c.id === activeId}
									/>
								))}
							</div>
						</div>
					))
				)}
			</div>

			<div className='border-t border-border-soft p-2.5 flex items-center gap-2.5'>
				<div className='w-7 h-7 rounded-full bg-surface-2 border border-border grid place-items-center font-mono text-[11px] font-semibold text-fg-2'>
					{initials(me.displayName)}
				</div>
				<div className='flex-1 min-w-0'>
					<div className='text-[12.5px] font-medium tracking-[-0.005em] truncate'>
						{me.displayName}
					</div>
					<div className='text-[11px] text-fg-faint truncate'>{me.email}</div>
				</div>
				<Button
					variant='ghost'
					size='sm'
					onClick={onLogout}
					disabled={logout.isPending}
					className='h-7 px-1.5'
				>
					<LogOut size={14} className='text-fg-muted' />
				</Button>
			</div>
		</aside>
	)
}

function SidebarItem({
	id,
	title,
	time,
	active,
}: {
	id: string
	title: string
	time: string
	active: boolean
}) {
	return (
		<Link
			to='/c/$id'
			params={{ id }}
			className={`px-3 py-2 rounded-[6px] border flex flex-col gap-0.5 transition-colors ${
				active
					? "bg-surface-2 border-border text-fg"
					: "bg-transparent border-transparent text-fg-2 hover:bg-surface-2/40"
			}`}
		>
			<div
				className={`text-[13px] truncate tracking-[-0.005em] ${active ? "font-medium" : "font-normal"}`}
			>
				{title}
			</div>
			<div className='text-[11px] text-fg-faint'>{time}</div>
		</Link>
	)
}

function EmptySidebar() {
	return (
		<div className='p-4.5 text-fg-muted text-[12.5px] leading-[1.55]'>
			<div className='border border-dashed border-border rounded-[8px] p-3.5 bg-white/[0.015]'>
				<div className='text-fg-2 font-medium mb-1'>Sem conversas ainda</div>
				Comece pela primeira pergunta. Suas conversas aparecem aqui, agrupadas por data.
			</div>
		</div>
	)
}

function initials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "?"
	if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "?"
	return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase()
}
