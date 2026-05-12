import type * as React from "react"

import { cn } from "@/lib/cn"

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: callers always pass htmlFor + children
		<label
			className={cn("block mb-1.5 text-[12px] font-medium text-fg-muted", className)}
			{...props}
		/>
	)
}
