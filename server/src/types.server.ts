import { Color, Coord, PIECE_TYPE } from "$shared/types"
import { Piece } from "./controllers/Piece"

export type Move = {
	type: "regular" | "en passant" | "promotion" | "castle"
	start: Coord
	end: Coord
	piece: Piece
	capture?: Capture
	promotion_type?: PIECE_TYPE
	associated_move?: Move
}

export type Capture = {
	coord: Coord
	piece: Piece
}

export type socket_data = {
	game_id: string
}
