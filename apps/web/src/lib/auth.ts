import type { UserPublic } from "@dd-chat/validators"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { ApiError, api } from "@/lib/api"

const ME_KEY = ["me"] as const

export type LoginInput = { identifier: string; password: string }
export type SignupInput = {
	email: string
	username: string
	displayName: string
	password: string
}

async function fetchMe(): Promise<UserPublic | null> {
	try {
		return await api.get<UserPublic>("/auth/me")
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) return null
		throw err
	}
}

export function useMe() {
	return useQuery({
		queryKey: ME_KEY,
		queryFn: fetchMe,
		staleTime: 60_000,
	})
}

export function useLogin() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: LoginInput) => api.post<UserPublic>("/auth/login", input),
		onSuccess: (user) => qc.setQueryData(ME_KEY, user),
	})
}

export function useSignup() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (input: SignupInput) => {
			await api.post<UserPublic>("/auth/signup", input)
			return api.post<UserPublic>("/auth/login", {
				identifier: input.email,
				password: input.password,
			})
		},
		onSuccess: (user) => qc.setQueryData(ME_KEY, user),
	})
}

export function useLogout() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: () => api.post<void>("/auth/logout", {}),
		onSuccess: () => qc.setQueryData(ME_KEY, null),
	})
}
