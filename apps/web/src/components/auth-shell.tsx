import type { ReactNode } from "react"

import { BrandMark } from "@/components/brand-mark"

export function AuthShell({ children }: { children: ReactNode }) {
	return (
		<div className='relative min-h-screen bg-bg text-fg overflow-hidden'>
			<div className='absolute top-6 left-8'>
				<BrandMark />
			</div>
			<div className='absolute inset-0 grid place-items-center px-4'>{children}</div>
			<div className='absolute bottom-5 left-8 text-[11px] text-fg-faint'>v1.0 · pt-BR</div>
			<div className='absolute bottom-5 right-8 flex gap-4 text-[11px] text-fg-faint'>
				<span>Termos</span>
				<span>Privacidade</span>
				<span>Suporte</span>
			</div>
		</div>
	)
}

export function AuthCard({
	title,
	subtitle,
	children,
}: {
	title: string
	subtitle: string
	children: ReactNode
}) {
	return (
		<div className='w-full max-w-[380px] rounded-[14px] border border-border bg-bg-elev shadow-[var(--shadow-2)] p-8 pb-7'>
			<h1 className='text-[20px] font-semibold tracking-[-0.015em] text-fg'>{title}</h1>
			<p className='mt-1.5 mb-6 text-[13px] text-fg-muted'>{subtitle}</p>
			{children}
		</div>
	)
}
