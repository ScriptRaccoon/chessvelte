// frontend config

import type { Coord, PIECE_TYPE } from "./types"

export const ROWS = [0, 1, 2, 3, 4, 5, 6, 7]
export const COLS = [0, 1, 2, 3, 4, 5, 6, 7]
export const SIZE = 8

export const COORDINATES = Array.from({ length: SIZE })
	.map((_, row) => Array.from({ length: SIZE }, (_, col) => [row, col]))
	.flat() as Coord[]

export const PROMOTION_PIECE_TYPES: PIECE_TYPE[] = [
	"queen",
	"rook",
	"bishop",
	"knight"
]

export const COOKIE_OPTIONS = {
	maxAge: 365 * 24 * 60 * 60,
	path: "/",
	sameSite: "lax",
	httpOnly: true,
	secure: true
} as const
