import type { Piece } from "../controllers/Piece.js"
import type { Color } from "../../../shared/types.js"
import { King } from "./King.js"
import { Bishop } from "./Bishop.js"
import { Knight } from "./Knight.js"
import { Pawn } from "./Pawn.js"
import { Queen } from "./Queen.js"
import { Rook } from "./Rook.js"

const constructor_map: Record<Piece["type"], Function> = {
	bishop: Bishop,
	king: King,
	knight: Knight,
	pawn: Pawn,
	queen: Queen,
	rook: Rook,
} as const

export function create_piece(
	type: Piece["type"],
	color: Color
): Bishop | King | Knight | Pawn | Queen | Rook {
	// @ts-ignore
	return new constructor_map[type](color)
}
