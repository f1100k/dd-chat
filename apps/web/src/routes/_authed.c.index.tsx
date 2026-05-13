import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Sparkles } from "lucide-react"

import { ChatInput } from "@/components/chat/chat-input"

export const Route = createFileRoute("/_authed/c/")({
	component: ConversationsIndex,
})

interface ExampleCard {
	chips: string[]
	question: string
}

const EXAMPLES: ExampleCard[] = [
	{
		chips: ["Magias", "Monstros"],
		question: "Bola de fogo contra um troll regenerando — funciona?",
	},
	{
		chips: ["Classes"],
		question: "Diferença entre druida da terra e da lua no nível 6",
	},
	{
		chips: ["Combate", "Habilidades"],
		question: "Quantas ações bônus eu tenho num turno?",
	},
]

function ConversationsIndex() {
	const { trpc } = Route.useRouteContext()
	const queryClient = useQueryClient()
	const navigate = useNavigate()

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

	return (
		<>
			<ChatHeader title='Nova conversa' />
			<div className='flex-1 grid place-items-center p-8'>
				<div className='w-[600px] max-w-full text-center'>
					<div className='w-11 h-11 rounded-[10px] bg-accent-soft border border-chip-border grid place-items-center mx-auto mb-4.5 text-accent'>
						<Sparkles size={22} className='text-accent' />
					</div>
					<h1 className='text-[22px] font-semibold tracking-[-0.018em] mb-2'>
						Pronto pra primeira pergunta?
					</h1>
					<p className='text-[14px] text-fg-muted leading-[1.55] max-w-[460px] mx-auto mb-7'>
						Antes de cada mensagem, escolha quais regras do SRD entram como contexto. Use{" "}
						<span className='kbd' style={{ verticalAlign: "1px" }}>
							+ Contexto
						</span>{" "}
						ou digite{" "}
						<span className='kbd' style={{ verticalAlign: "1px" }}>
							/
						</span>{" "}
						no campo abaixo.
					</p>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-1.5'>
						{EXAMPLES.map((ex) => (
							<button
								key={ex.question}
								type='button'
								disabled={create.isPending}
								onClick={() => create.mutate({})}
								className='bg-bg-elev border border-border-soft rounded-[10px] p-3.5 text-left cursor-pointer hover:bg-surface-2/40 transition-colors disabled:opacity-50'
							>
								<div className='flex flex-wrap gap-1 mb-2'>
									{ex.chips.map((c) => (
										<span key={c} className='chip-static'>
											{c}
										</span>
									))}
								</div>
								<div className='text-[12.5px] text-fg-2 leading-[1.45] tracking-[-0.005em]'>
									{ex.question}
								</div>
							</button>
						))}
					</div>
					<p className='text-[11px] text-fg-faint mt-2.5'>
						Exemplos clicáveis · começam com o contexto sugerido
					</p>
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

function ChatHeader({ title }: { title: string }) {
	return (
		<div className='h-13 px-5 flex items-center gap-3 border-b border-border-soft'>
			<div className='text-[13.5px] font-medium tracking-[-0.005em]'>{title}</div>
		</div>
	)
}
