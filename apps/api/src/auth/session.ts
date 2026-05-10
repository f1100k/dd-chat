import { prisma } from "@dd-chat/db"
import crypto from "node:crypto"
import type { Context } from "hono"

type SessionCookie = { token: string; expiresAt: Date }

const SESSION_TTL_DAYS = 7
const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000

function generateToken(): string {
	return crypto.randomBytes(32).toString("hex")
}

export async function createSession(userId: string) {
	return prisma.session.create({
		data: {
			token: generateToken(),
			userId,
			expiresAt: new Date(Date.now() + SESSION_TTL_MS),
		},
		select: {
			id: true,
			token: true,
			userId: true,
			expiresAt: true,
		},
	})
}

export function setSessionCookie(c: Context, session: SessionCookie) {
	const maxAgeSeconds = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000)

	c.header(
		"Set-Cookie",
		[
			`session=${session.token}`,
			`Max-Age=${maxAgeSeconds}`,
			"SameSite=Lax",
			"HttpOnly",
			"Path=/",
			// 'Secure' — só HTTPS, ligar em produção
		].join("; "),
	)
}
