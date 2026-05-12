import { loginSchema } from "@dd-chat/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router"
import { Eye, Lock, Mail, TriangleAlert } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { AuthCard, AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api"
import { type LoginInput, useLogin } from "@/lib/auth"

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		const me = await context.loadMe()
		if (me) throw redirect({ to: "/" })
	},
	component: LoginPage,
})

function LoginPage() {
	const router = useRouter()
	const login = useLogin()
	const [serverError, setServerError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: { identifier: "", password: "" },
	})

	const onSubmit = handleSubmit(async (values) => {
		setServerError(null)
		try {
			await login.mutateAsync(values)
			await router.invalidate()
			await router.navigate({ to: "/" })
		} catch (err) {
			if (err instanceof ApiError && err.status === 401) {
				setServerError("E-mail ou senha inválidos.")
				return
			}
			setServerError("Não conseguimos entrar agora. Tente de novo.")
		}
	})

	const passwordInvalid = Boolean(errors.password) || Boolean(serverError)

	return (
		<AuthShell>
			<AuthCard title='Entrar' subtitle='Acesse seu chat de D&D'>
				<form onSubmit={onSubmit} noValidate>
					<div className='mb-3.5'>
						<Label htmlFor='identifier'>E-mail ou usuário</Label>
						<Input
							id='identifier'
							type='text'
							autoComplete='username'
							placeholder='marina@exemplo.com'
							leading={<Mail size={15} />}
							invalid={Boolean(errors.identifier)}
							{...register("identifier")}
						/>
					</div>

					<div className={serverError ? "mb-2" : "mb-5"}>
						<Label htmlFor='password'>Senha</Label>
						<Input
							id='password'
							type='password'
							autoComplete='current-password'
							placeholder='••••••••••'
							leading={<Lock size={15} />}
							trailing={<Eye size={15} />}
							invalid={passwordInvalid}
							{...register("password")}
						/>
						{serverError ? (
							<p className='mt-2 flex items-center gap-1.5 text-[12px] text-danger'>
								<TriangleAlert size={13} />
								{serverError}
							</p>
						) : null}
					</div>

					<Button type='submit' size='lg' className='w-full' disabled={login.isPending}>
						{login.isPending ? "Entrando…" : "Entrar"}
					</Button>
				</form>

				<p className='mt-4 text-center text-[12px] text-fg-muted'>
					Não tem conta?{" "}
					<Link to='/signup' className='font-medium text-accent hover:underline'>
						Criar conta
					</Link>
				</p>
			</AuthCard>
		</AuthShell>
	)
}
