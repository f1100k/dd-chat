import type * as React from "react"

import { cn } from "@/lib/cn"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	invalid?: boolean
	leading?: React.ReactNode
	trailing?: React.ReactNode
}

export function Input({ className, invalid, leading, trailing, ...props }: InputProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 h-[38px] px-3 rounded-[8px] border bg-bg-elev text-[14px] text-fg transition-colors",
				"focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/14",
				invalid && "border-danger ring-3 ring-danger/14",
				!invalid && "border-border",
				className,
			)}
		>
			{leading ? <span className='text-fg-muted flex-shrink-0'>{leading}</span> : null}
			<input
				className='flex-1 bg-transparent outline-none placeholder:text-fg-faint text-fg'
				{...props}
			/>
			{trailing ? <span className='text-fg-muted flex-shrink-0'>{trailing}</span> : null}
		</div>
	)
}
