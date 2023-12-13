// backend config

import type { Color, PIECE_TYPE } from "./types"

export const DIRECTION: Record<Color, number> = {
	black: +1,
	white: -1
}

export const ROWS = [0, 1, 2, 3, 4, 5, 6, 7]
export const COLS = [0, 1, 2, 3, 4, 5, 6, 7]
export const SIZE = 8

export const VALUES: Record<PIECE_TYPE, number> = {
	rook: 5,
	bishop: 3,
	knight: 3,
	pawn: 1,
	queen: 9,
	king: Number.POSITIVE_INFINITY
}
