import { Coord, Piece_Type, Coord_Key } from "$shared/types"
import { type Piece } from "./controllers/Piece"

export type Piece_Map = Record<Coord_Key, Piece | undefined>

export type Move = {
	type: "regular" | "en passant" | "promotion" | "castle"
	start: Coord
	end: Coord
	piece: Piece
	capture?: Capture
	promotion_type?: Piece_Type
	associated_move?: Move
}

export type Capture = {
	coord: Coord
	piece: Piece
}
