import type { Color, Piece_Type } from "./types"

export const TITLE = "Chessvelte"

export const ROWS = [0, 1, 2, 3, 4, 5, 6, 7]
export const COLS = [0, 1, 2, 3, 4, 5, 6, 7]
export const SIZE = 8

export const PROMOTION_PIECE_TYPES: Piece_Type[] = [
	"queen",
	"rook",
	"bishop",
	"knight",
]

export const COOKIE_OPTIONS = {
	maxAge: 365 * 24 * 60 * 60,
	path: "/",
	sameSite: "lax",
	httpOnly: true,
	secure: true,
} as const

export const DIRECTION: Record<Color, number> = {
	black: +1,
	white: -1,
}

export const PIECE_VALUES: Record<Piece_Type, number> = {
	rook: 5,
	bishop: 3,
	knight: 3,
	pawn: 1,
	queen: 9,
	king: Number.POSITIVE_INFINITY,
}

export const CHARACTERS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
