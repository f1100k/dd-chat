import crypto from "node:crypto"
import { prisma } from "@dd-chat/db"
import type { Context } from "hono"
import { deleteCookie, setCookie } from "hono/cookie"

type SessionCookie = { token: string; expiresAt: Date }

const SESSION_TTL_DAYS = 7
const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000

const COOKIE_NAME = "session"

function generateToken(): string {
	return crypto.randomBytes(32).toString("hex")
}

const sessionSelect = {
	id: true,
	token: true,
	userId: true,
	expiresAt: true,
} as const

export async function createSession(userId: string) {
	return prisma.session.create({
		data: {
			token: generateToken(),
			userId,
			expiresAt: new Date(Date.now() + SESSION_TTL_MS),
		},
		select: sessionSelect,
	})
}

export async function getActiveSessionByToken(token: string) {
	const session = await prisma.session.findUnique({
		where: { token },
		select: sessionSelect,
	})

	if (!session || session.expiresAt <= new Date()) {
		return null
	}

	return session
}

export function setSessionCookie(c: Context, session: SessionCookie) {
	const maxAge = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)

	setCookie(c, COOKIE_NAME, session.token, {
		maxAge,
		httpOnly: true,
		sameSite: "Lax",
		path: "/",
		// secure: true — habilitar em produção (HTTPS only)
	})
}

export function clearSessionCookie(c: Context) {
	deleteCookie(c, COOKIE_NAME, {
		path: "/",
		sameSite: "Lax",
		httpOnly: true,
	})
}

export async function revokeSession(token: string) {
	await prisma.session.deleteMany({ where: { token } })
}
