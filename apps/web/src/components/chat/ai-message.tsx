import { Copy, RefreshCw, Sparkles } from "lucide-react"

interface AIMessageProps {
	content: string
	state?: "done" | "streaming" | "error"
	createdAt: Date | string
}

export function AIMessage({ content, state = "done", createdAt }: AIMessageProps) {
	const time = (createdAt instanceof Date ? createdAt : new Date(createdAt)).toLocaleTimeString(
		"pt-BR",
		{ hour: "2-digit", minute: "2-digit" },
	)

	return (
		<div className='flex gap-3.5 py-5'>
			<div className='w-7 h-7 rounded-[6px] bg-accent-soft border border-chip-border grid place-items-center text-accent flex-shrink-0'>
				<Sparkles size={15} className='text-accent' />
			</div>
			<div className='flex-1 min-w-0'>
				<div className='flex items-baseline gap-2 mb-1.5'>
					<div className='text-[12.5px] font-semibold'>D&D Chat</div>
					<div className='text-[11px] text-fg-faint'>{time}</div>
					{state === "streaming" ? (
						<div className='text-[11px] text-accent inline-flex items-center gap-1.5 ml-1'>
							<span className='w-1.5 h-1.5 rounded-full bg-accent' />
							gerando
						</div>
					) : null}
				</div>

				{state === "error" ? (
					<div className='bg-danger-soft border border-danger/40 rounded-[8px] px-3.5 py-3 flex items-start gap-2.5'>
						<div className='flex-1'>
							<div className='text-[13px] text-danger font-medium'>
								Não consegui gerar a resposta.
							</div>
							<div className='text-[12.5px] text-fg-muted mt-0.5'>{content}</div>
						</div>
						<button
							type='button'
							className='inline-flex items-center gap-1 h-7 px-2.5 rounded-[6px] border border-border text-fg-2 text-[12px] cursor-pointer'
						>
							<RefreshCw size={13} />
							<span>Tentar de novo</span>
						</button>
					</div>
				) : (
					<div className='text-[14.5px] leading-[1.65] text-fg tracking-[-0.005em] whitespace-pre-wrap'>
						{content}
						{state === "streaming" ? (
							<span className='inline-block w-2 h-4 bg-accent ml-0.5 align-[-2px] animate-pulse' />
						) : null}
					</div>
				)}

				{state === "done" ? (
					<div className='mt-3 flex gap-1.5 text-fg-muted'>
						<button
							type='button'
							className='inline-flex items-center gap-1 h-6.5 px-2 rounded-[6px] text-[11.5px] hover:bg-surface-2/40 cursor-pointer'
						>
							<Copy size={12} /> Copiar
						</button>
						<button
							type='button'
							className='inline-flex items-center gap-1 h-6.5 px-2 rounded-[6px] text-[11.5px] hover:bg-surface-2/40 cursor-pointer'
						>
							<RefreshCw size={12} /> Regenerar
						</button>
					</div>
				) : null}
			</div>
		</div>
	)
}
