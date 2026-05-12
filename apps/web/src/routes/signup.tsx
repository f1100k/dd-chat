import { signupSchema } from "@dd-chat/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router"
import { Check, Lock, Mail, TriangleAlert, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { AuthCard, AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api"
import { type SignupInput, useSignup } from "@/lib/auth"

export const Route = createFileRoute("/signup")({
	beforeLoad: async ({ context }) => {
		const me = await context.loadMe()
		if (me) throw redirect({ to: "/" })
	},
	component: SignupPage,
})

function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
	if (!pw) return { score: 0, label: "Mínimo 8 caracteres." }
	let score = 0
	if (pw.length >= 8) score++
	if (pw.length >= 12) score++
	if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
	if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
	const labels = ["Muito fraca.", "Fraca.", "Aceitável.", "Boa.", "Forte."] as const
	return { score: score as 0 | 1 | 2 | 3 | 4, label: `Mínimo 8 caracteres. ${labels[score]}` }
}

function SignupPage() {
	const router = useRouter()
	const signup = useSignup()
	const [serverError, setServerError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignupInput>({
		resolver: zodResolver(signupSchema),
		defaultValues: { email: "", username: "", displayName: "", password: "" },
	})

	const password = watch("password")
	const email = watch("email")
	const strength = passwordStrength(password)

	const onSubmit = handleSubmit(async (values) => {
		setServerError(null)
		try {
			await signup.mutateAsync(values)
			await router.invalidate()
			await router.navigate({ to: "/" })
		} catch (err) {
			if (err instanceof ApiError && err.status === 409) {
				setServerError("Já existe uma conta com esse e-mail ou usuário.")
				return
			}
			if (err instanceof ApiError && err.status === 400) {
				setServerError(err.message)
				return
			}
			setServerError("Não conseguimos criar a conta agora. Tente de novo.")
		}
	})

	return (
		<AuthShell>
			<AuthCard title='Criar conta' subtitle='Leva menos de um minuto.'>
				<form onSubmit={onSubmit} noValidate>
					<div className='mb-3.5'>
						<Label htmlFor='displayName'>Nome</Label>
						<Input
							id='displayName'
							type='text'
							autoComplete='name'
							placeholder='Marina'
							leading={<User size={15} />}
							invalid={Boolean(errors.displayName)}
							{...register("displayName")}
						/>
						{errors.displayName ? (
							<p className='mt-1.5 text-[11px] text-danger'>{errors.displayName.message}</p>
						) : null}
					</div>

					<div className='mb-3.5'>
						<Label htmlFor='username'>Usuário</Label>
						<Input
							id='username'
							type='text'
							autoComplete='username'
							placeholder='marina'
							leading={<User size={15} />}
							invalid={Boolean(errors.username)}
							{...register("username")}
						/>
						<p className='mt-1.5 text-[11px] text-fg-faint'>
							{errors.username ? errors.username.message : "Letras minúsculas, números e hífens."}
						</p>
					</div>

					<div className='mb-3.5'>
						<Label htmlFor='email'>E-mail</Label>
						<Input
							id='email'
							type='email'
							autoComplete='email'
							placeholder='marina@exemplo.com'
							leading={<Mail size={15} />}
							trailing={
								email && !errors.email ? <Check size={14} className='text-success' /> : null
							}
							invalid={Boolean(errors.email)}
							{...register("email")}
						/>
						{errors.email ? (
							<p className='mt-1.5 text-[11px] text-danger'>{errors.email.message}</p>
						) : null}
					</div>

					<div className='mb-2'>
						<Label htmlFor='password'>Senha</Label>
						<Input
							id='password'
							type='password'
							autoComplete='new-password'
							placeholder='••••••••'
							leading={<Lock size={15} />}
							invalid={Boolean(errors.password)}
							{...register("password")}
						/>
						<div className='mt-2 flex gap-1'>
							{[1, 2, 3, 4].map((bar) => (
								<div
									key={bar}
									className={`flex-1 h-[3px] rounded-[2px] ${
										bar <= strength.score ? "bg-accent" : "bg-border"
									}`}
								/>
							))}
						</div>
						<p className='mt-1.5 text-[11px] text-fg-muted'>
							{errors.password ? errors.password.message : strength.label}
						</p>
					</div>

					{serverError ? (
						<p className='mb-2 flex items-center gap-1.5 text-[12px] text-danger'>
							<TriangleAlert size={13} />
							{serverError}
						</p>
					) : null}

					<Button type='submit' size='lg' className='w-full mt-4' disabled={signup.isPending}>
						{signup.isPending ? "Criando…" : "Criar conta"}
					</Button>
				</form>

				<p className='mt-4 text-center text-[12px] text-fg-muted'>
					Já tem conta?{" "}
					<Link to='/login' className='font-medium text-accent hover:underline'>
						Entrar
					</Link>
				</p>
			</AuthCard>
		</AuthShell>
	)
}
