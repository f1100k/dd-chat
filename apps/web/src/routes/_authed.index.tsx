import { createFileRoute, useRouter } from "@tanstack/react-router"
import { LogOut } from "lucide-react"

import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/lib/auth"

export const Route = createFileRoute("/_authed/")({
	component: HomePage,
})

function HomePage() {
	const { me } = Route.useRouteContext()
	const router = useRouter()
	const logout = useLogout()

	const onLogout = async () => {
		await logout.mutateAsync()
		await router.invalidate()
		await router.navigate({ to: "/login" })
	}

	return (
		<div className='min-h-screen bg-bg text-fg flex flex-col'>
			<header className='h-13 flex items-center justify-between px-5 border-b border-border-soft'>
				<BrandMark size='sm' />
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
			<main className='flex-1 grid place-items-center px-6 text-center'>
				<div className='max-w-[460px]'>
					<p className='text-[22px] font-semibold tracking-[-0.018em]'>Próximo: o chat.</p>
					<p className='mt-2 text-[14px] text-fg-muted leading-[1.55]'>
						Você está autenticado. As telas de conversa entram nos milestones 7 e 8 do roadmap.
					</p>
				</div>
			</main>
		</div>
	)
}
