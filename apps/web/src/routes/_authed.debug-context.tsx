import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { ArrowLeft, LogOut, Sparkles } from "lucide-react"
import { useState } from "react"

import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/lib/auth"
import {
	CATEGORY_KEYS,
	type CategoryKey,
	type ContextPreviewV2Response,
	useContextPreview,
	useContextPreviewV2,
	useContextPreviewV3,
} from "@/lib/context"

export const Route = createFileRoute("/_authed/debug-context")({
	component: DebugContextPage,
})

type Mode = "v1" | "v2" | "v3"

const MODE_LABELS: Record<Mode, string> = {
	v1: "v1 (full)",
	v2: "v2 (tool calling)",
	v3: "v3 (structured)",
}

function DebugContextPage() {
	const { me } = Route.useRouteContext()
	const router = useRouter()
	const logout = useLogout()
	const previewV1 = useContextPreview()
	const previewV2 = useContextPreviewV2()
	const previewV3 = useContextPreviewV3()
	const [selected, setSelected] = useState<Set<CategoryKey>>(new Set())
	const [userMessage, setUserMessage] = useState("")
	const [mode, setMode] = useState<Mode>("v1")

	const onToggle = (key: CategoryKey) => {
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(key)) next.delete(key)
			else next.add(key)
			return next
		})
	}

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const body = { selectedCategories: Array.from(selected), userMessage }
		if (mode === "v1") previewV1.mutate(body)
		else if (mode === "v2") previewV2.mutate(body)
		else previewV3.mutate(body)
	}

	const onLogout = async () => {
		await logout.mutateAsync()
		await router.invalidate()
		await router.navigate({ to: "/login" })
	}

	const active = mode === "v1" ? previewV1 : mode === "v2" ? previewV2 : previewV3
	const v1Data = mode === "v1" ? previewV1.data : undefined
	const v2Data = mode === "v2" ? previewV2.data : undefined
	const v3Data = mode === "v3" ? previewV3.data : undefined
	const data = v1Data ?? v2Data ?? v3Data
	const intentData = v2Data ?? v3Data

	return (
		<div className='min-h-screen bg-bg text-fg flex flex-col'>
			<header className='h-13 flex items-center justify-between px-5 border-b border-border-soft'>
				<div className='flex items-center gap-4'>
					<BrandMark size='sm' />
					<Link to='/' className='flex items-center gap-1 text-[12px] text-fg-muted hover:text-fg'>
						<ArrowLeft size={13} />
						Voltar
					</Link>
				</div>
				<div className='flex items-center gap-3'>
					<span className='text-[12.5px] text-fg-2'>
						Olá, <span className='font-medium'>{me.displayName}</span>
					</span>
					<Button variant='ghost' size='sm' onClick={onLogout} disabled={logout.isPending}>
						<LogOut size={13} />
						Sair
					</Button>
				</div>
			</header>

			<main className='flex-1 p-6 max-w-[1200px] mx-auto w-full'>
				<div className='mb-5'>
					<h1 className='text-[20px] font-semibold tracking-[-0.015em] flex items-center gap-2'>
						<Sparkles size={17} className='text-accent' />
						Debug: builder de contexto
					</h1>
					<p className='mt-1 text-[13px] text-fg-muted'>
						v1 = categoria inteira. v2 = LLM com tool calling (multi-step). v3 = LLM com structured
						output (single round-trip). v2 e v3 caem pro full se o intent vier vazio.
					</p>
				</div>

				<form onSubmit={onSubmit} className='mb-6'>
					<div className='mb-4'>
						<div className='text-[12px] text-fg-muted mb-2'>Modo</div>
						<div className='inline-flex rounded-[8px] border border-border bg-bg-elev p-1'>
							{(["v1", "v2", "v3"] as const).map((m) => (
								<button
									key={m}
									type='button'
									onClick={() => setMode(m)}
									className={`px-3 h-7 rounded-[6px] text-[12.5px] font-medium transition-colors ${
										mode === m ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
									}`}
								>
									{MODE_LABELS[m]}
								</button>
							))}
						</div>
					</div>

					<div className='mb-4'>
						<div className='text-[12px] text-fg-muted mb-2'>Categorias</div>
						<div className='flex flex-wrap gap-2'>
							{CATEGORY_KEYS.map((key) => {
								const isActive = selected.has(key)
								return (
									<button
										key={key}
										type='button'
										onClick={() => onToggle(key)}
										className={`h-8 px-3 rounded-[6px] border text-[12.5px] transition-colors ${
											isActive
												? "bg-accent text-accent-fg border-transparent font-medium"
												: "bg-bg-elev text-fg-2 border-border hover:bg-surface-2/60"
										}`}
									>
										{key}
									</button>
								)
							})}
						</div>
					</div>

					<div className='mb-4'>
						<label htmlFor='userMessage' className='block text-[12px] text-fg-muted mb-1.5'>
							User message {mode === "v1" ? "(opcional)" : "(obrigatório)"}
						</label>
						<textarea
							id='userMessage'
							value={userMessage}
							onChange={(e) => setUserMessage(e.target.value)}
							rows={3}
							placeholder='Ex: como funciona a magia fireball?'
							className='w-full px-3 py-2 rounded-[8px] border border-border bg-bg-elev text-[13.5px] text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/14 resize-y'
						/>
					</div>

					<Button type='submit' disabled={active.isPending}>
						{active.isPending ? "Gerando…" : `Gerar prompt (${mode})`}
					</Button>
					{active.isError ? (
						<span className='ml-3 text-[12px] text-danger'>
							{active.error?.message ?? "Erro ao gerar."}
						</span>
					) : null}
				</form>

				{data ? (
					<>
						{intentData ? <V2Metrics data={intentData} label={MODE_LABELS[mode]} /> : null}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
							<ResultPanel
								title='systemPrompt'
								subtitle={`${data.systemPrompt.length.toLocaleString()} chars`}
								content={data.systemPrompt}
							/>
							<ResultPanel
								title='injectedContext'
								subtitle={`${data.injectedContext.length.toLocaleString()} chars`}
								content={data.injectedContext || "(vazio — nenhuma categoria selecionada)"}
							/>
						</div>
					</>
				) : null}
			</main>
		</div>
	)
}

function V2Metrics({ data, label }: { data: ContextPreviewV2Response; label: string }) {
	const targeted = data.mode === "targeted"
	const savedChars = data.fullInjectionChars - data.injectedContext.length
	const savedPct = data.fullInjectionChars > 0 ? (savedChars / data.fullInjectionChars) * 100 : 0

	return (
		<section className='mb-4 rounded-[10px] border border-border bg-bg-elev p-4'>
			<header className='flex items-center justify-between mb-3'>
				<div className='flex items-center gap-2'>
					<span className='text-[12.5px] font-medium text-fg'>{label} — intent metrics</span>
					<span
						className={`px-2 h-5 inline-flex items-center rounded-[4px] text-[11px] font-medium ${
							targeted ? "bg-success/15 text-success" : "bg-fg-muted/15 text-fg-muted"
						}`}
					>
						{data.mode}
					</span>
				</div>
				<span className='text-[11px] text-fg-faint'>
					{data.intent.model}
					{data.intent.provider ? ` via ${data.intent.provider}` : ""}
				</span>
			</header>

			<div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]'>
				<Metric label='input tokens' value={data.intent.inputTokens.toLocaleString()} />
				<Metric label='output tokens' value={data.intent.outputTokens.toLocaleString()} />
				<Metric label='latency' value={`${data.intent.latencyMs.toLocaleString()} ms`} />
				<Metric
					label='context saved'
					value={`${savedChars.toLocaleString()} chars (${savedPct.toFixed(1)}%)`}
					accent={targeted && savedChars > 0}
				/>
			</div>

			{data.intent.toolCalls.length > 0 ? (
				<div className='mt-3 pt-3 border-t border-border-soft'>
					<div className='text-[11px] text-fg-muted mb-1.5'>tool calls</div>
					<ul className='text-[12px] space-y-1'>
						{data.intent.toolCalls.map((tc) => (
							<li key={`${tc.category}:${tc.query}`} className='font-mono'>
								<span className='text-accent'>lookup_{tc.category}</span>
								<span className='text-fg-muted'>("{tc.query}")</span>
								<span className='text-fg-muted'> → </span>
								<span className='text-fg'>
									{tc.matched.length > 0 ? tc.matched.join(", ") : "(nada casou)"}
								</span>
							</li>
						))}
					</ul>
				</div>
			) : (
				<p className='mt-3 pt-3 border-t border-border-soft text-[12px] text-fg-muted'>
					Nenhuma tool foi chamada — fallback pro contexto completo.
				</p>
			)}
		</section>
	)
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
	return (
		<div>
			<div className='text-[11px] text-fg-faint mb-0.5'>{label}</div>
			<div className={`text-[13px] font-medium ${accent ? "text-success" : "text-fg"}`}>
				{value}
			</div>
		</div>
	)
}

function ResultPanel({
	title,
	subtitle,
	content,
}: {
	title: string
	subtitle: string
	content: string
}) {
	return (
		<section className='rounded-[10px] border border-border bg-bg-elev overflow-hidden'>
			<header className='px-3.5 py-2 border-b border-border-soft flex items-center justify-between'>
				<span className='text-[12.5px] font-medium text-fg'>{title}</span>
				<span className='text-[11px] text-fg-faint'>{subtitle}</span>
			</header>
			<pre className='p-3.5 text-[12px] leading-[1.55] text-fg-2 whitespace-pre-wrap break-words max-h-[70vh] overflow-auto font-mono'>
				{content}
			</pre>
		</section>
	)
}
