import type { Piece } from "../controllers/Piece"
import type { Color } from "$shared/types"
import { King } from "./King"
import { Bishop } from "./Bishop"
import { Knight } from "./Knight"
import { Pawn } from "./Pawn"
import { Queen } from "./Queen"
import { Rook } from "./Rook"

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
	color: Color,
): Bishop | King | Knight | Pawn | Queen | Rook {
	// @ts-ignore
	return new constructor_map[type](color)
}
