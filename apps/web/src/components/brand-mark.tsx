import { cn } from "@/lib/cn"

interface BrandMarkProps {
	size?: "sm" | "md"
	showWordmark?: boolean
	className?: string
}

export function BrandMark({ size = "md", showWordmark = true, className }: BrandMarkProps) {
	const dim = size === "sm" ? 22 : 28
	const font = size === "sm" ? 11 : 13
	return (
		<div className={cn("inline-flex items-center gap-2.5 text-fg", className)}>
			<div
				className='grid place-items-center bg-accent text-accent-fg font-mono font-bold rounded-[6px]'
				style={{ width: dim, height: dim, fontSize: font }}
			>
				d20
			</div>
			{showWordmark ? <span className='font-semibold tracking-[-0.01em]'>D&amp;D Chat</span> : null}
		</div>
	)
}
