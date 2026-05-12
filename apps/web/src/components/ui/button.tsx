import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/cn"

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-1.5 rounded-[6px] border font-medium tracking-[-0.005em] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/40",
	{
		variants: {
			variant: {
				primary: "bg-accent text-accent-fg border-transparent font-semibold hover:bg-accent/90",
				secondary: "bg-surface-2 text-fg border-border hover:bg-surface",
				ghost: "bg-transparent border-transparent text-fg-2 hover:bg-surface-2/60",
			},
			size: {
				sm: "h-7 px-2 text-[12px]",
				md: "h-8 px-3 text-[13px]",
				lg: "h-[38px] px-4 text-[14px]",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
)

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
	return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
