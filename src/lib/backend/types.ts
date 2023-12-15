// backend types

import type { Piece } from "./controllers/Piece"

export type Color = "black" | "white"

export type Coord = [number, number]

export type Coord_Key = `${number}${number}`

export type Move = {
	type: "regular" | "en passant" | "promotion" | "castle"
	start: Coord
	end: Coord
	piece: Piece
	capture?: Capture
	promotion_type?: Piece["type"]
	associated_move?: Move
}

export type Capture = {
	coord: Coord
	piece: Piece
}

export type Callback = () => void

export type PIECE_TYPE =
	| "pawn"
	| "rook"
	| "knight"
	| "bishop"
	| "queen"
	| "king"

export type GAME_STATUS =
	| "waiting"
	| "ready"
	| "playing"
	| "check"
	| "checkmate"
	| "stalemate"
