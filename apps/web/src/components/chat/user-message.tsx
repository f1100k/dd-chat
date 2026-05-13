import { ChevronDown, ChevronRight, Copy } from "lucide-react"
import { useState } from "react"

interface UserMessageProps {
	content: string
	chips?: string[]
	injectedContext?: string | null
	authorInitials: string
	createdAt: Date | string
}

export function UserMessage({
	content,
	chips = [],
	injectedContext,
	authorInitials,
	createdAt,
}: UserMessageProps) {
	const [expanded, setExpanded] = useState(false)
	const time = (createdAt instanceof Date ? createdAt : new Date(createdAt)).toLocaleTimeString(
		"pt-BR",
		{ hour: "2-digit", minute: "2-digit" },
	)
	const ctxLines = injectedContext ? injectedContext.split("\n").length : 0

	return (
		<div className='flex gap-3.5 py-5'>
			<div className='w-7 h-7 rounded-full bg-surface-2 border border-border grid place-items-center font-mono text-[10.5px] font-semibold text-fg-2 flex-shrink-0'>
				{authorInitials}
			</div>
			<div className='flex-1 min-w-0'>
				<div className='flex items-baseline gap-2 mb-1.5'>
					<div className='text-[12.5px] font-semibold'>Você</div>
					<div className='text-[11px] text-fg-faint'>{time}</div>
				</div>
				<div className='text-[14.5px] leading-[1.55] text-fg tracking-[-0.005em] whitespace-pre-wrap'>
					{content}
				</div>

				{chips.length > 0 ? (
					<div className='flex flex-wrap gap-1.5 mt-2.5'>
						{chips.map((c) => (
							<span key={c} className='chip-static'>
								{c}
							</span>
						))}
					</div>
				) : null}

				{injectedContext ? (
					<>
						<button
							type='button'
							onClick={() => setExpanded((v) => !v)}
							className='mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] text-fg-muted hover:text-fg cursor-pointer select-none'
						>
							{expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
							{expanded ? "Ocultar contexto injetado" : "Ver contexto injetado"}
							<span className='font-mono text-[10.5px] text-fg-faint ml-1'>
								· {ctxLines} linhas
							</span>
						</button>

						{expanded ? (
							<div className='mt-2.5 bg-bg-elev border border-border-soft rounded-[8px] font-mono text-[11.5px] leading-[1.6] text-fg-2 relative overflow-hidden max-h-[300px]'>
								<div className='px-3 py-2 border-b border-border-soft text-fg-muted text-[10.5px] tracking-[0.04em] uppercase font-semibold flex items-center gap-2'>
									<span>SRD: {chips.join(" + ") || "contexto"}</span>
									<span className='ml-auto text-fg-faint normal-case font-normal tracking-normal'>
										{ctxLines} linhas
									</span>
									<Copy size={12} className='text-fg-muted cursor-pointer' />
								</div>
								<pre className='px-3 py-2.5 whitespace-pre-wrap break-words overflow-y-auto max-h-[240px]'>
									{injectedContext}
								</pre>
							</div>
						) : null}
					</>
				) : null}
			</div>
		</div>
	)
}
