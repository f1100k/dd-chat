import { Plus, Send, X } from "lucide-react"
import { useState } from "react"

interface ChatInputProps {
	/** Chips de contexto atualmente selecionadas. Mutável localmente; persistência vem no M6. */
	initialChips?: string[]
	/** Texto inicial (decorativo). */
	initialText?: string
	/** Placeholder do textarea quando vazio. */
	placeholder?: string
}

/**
 * Visual replica do ChatInput do design hifi.
 *
 * Esta versão é DECORATIVA — o textarea aceita digitação e as chips podem ser
 * removidas localmente, mas o botão Enviar é no-op até o M6 plugar o stream
 * SSE de chat.
 */
export function ChatInput({
	initialChips = [],
	initialText = "",
	placeholder = "Pergunte algo sobre D&D…",
}: ChatInputProps) {
	const [chips, setChips] = useState<string[]>(initialChips)
	const [text, setText] = useState(initialText)

	const removeChip = (c: string) => setChips((prev) => prev.filter((x) => x !== c))
	const canSend = text.trim().length > 0

	return (
		<div className='relative'>
			<div className='rounded-[12px] border border-border bg-bg-elev shadow-[var(--shadow-2)]'>
				{chips.length > 0 ? (
					<div className='px-3 pt-2.5 pb-2 border-b border-border-soft flex items-center flex-wrap gap-1.5'>
						<span className='text-[10.5px] text-fg-faint uppercase tracking-[0.06em] font-semibold mr-1'>
							Contexto
						</span>
						{chips.map((c) => (
							<button
								key={c}
								type='button'
								onClick={() => removeChip(c)}
								className='inline-flex items-center gap-1.5 h-6 pl-2.5 pr-2 bg-chip-bg border border-chip-border rounded-full text-chip-fg font-mono text-[11px] font-medium hover:opacity-90 cursor-pointer'
							>
								{c}
								<X size={10} className='opacity-60' />
							</button>
						))}
					</div>
				) : null}

				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={placeholder}
					rows={2}
					className='w-full px-4 pt-3.5 pb-1.5 min-h-[56px] resize-none bg-transparent text-[14.5px] leading-[1.55] tracking-[-0.005em] text-fg placeholder:text-fg-faint focus:outline-none'
				/>

				<div className='px-2.5 pb-2.5 flex items-center gap-2'>
					<button
						type='button'
						className='inline-flex items-center gap-1.5 h-7.5 px-3 rounded-[6px] border border-border bg-transparent text-fg-2 text-[12.5px] hover:bg-surface-2/40 cursor-pointer'
					>
						<Plus size={13} className='text-fg-2' />
						<span>Contexto</span>
					</button>

					<div className='text-[11px] text-fg-faint inline-flex items-center gap-1.5'>
						<span className='kbd'>/</span>
						<span>atalho rápido</span>
					</div>

					<div className='flex-1' />

					<div className='text-[11px] text-fg-faint mr-1 hidden md:inline-flex items-center gap-1.5'>
						<span className='kbd'>↵</span>
						<span>enviar</span>
						<span className='mx-1'>·</span>
						<span className='kbd'>⇧↵</span>
						<span>nova linha</span>
					</div>

					<button
						type='button'
						disabled={!canSend}
						title='Chat com LLM entra no M6'
						className='inline-flex items-center gap-1.5 h-7.5 px-3 rounded-[6px] bg-accent text-accent-fg font-semibold text-[12.5px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
					>
						<span>Enviar</span>
						<Send size={13} className='text-accent-fg' />
					</button>
				</div>
			</div>
		</div>
	)
}
