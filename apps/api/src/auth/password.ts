import bcrypt from "bcrypt"

const SALT_ROUNDS = process.env.NODE_ENV === "production" ? 14 : 1

export async function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
	return bcrypt.compare(plain, hash)
}
