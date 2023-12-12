import { customAlphabet } from "nanoid"

export const nanoid = customAlphabet("abcdefABCDEF0123456789")

export const COOKIE_OPTIONS = {
	maxAge: 365 * 24 * 60 * 60,
	path: "/",
	sameSite: "lax",
	httpOnly: true,
	secure: true
} as const
