import { Coord, Piece_Type, Coord_Key, Move_Type } from "$shared/types"
import { type Piece } from "./controllers/Piece"

export type Piece_Map = Record<Coord_Key, Piece | undefined>

export type Move = {
	type: Move_Type
	start: Coord
	end: Coord
	piece: Piece
	capture?: Capture
	promotion_choice?: Piece_Type
	associated_move?: Move
}

export type Capture = {
	coord: Coord
	piece: Piece
}

export type Possible_Moves = Record<Coord_Key, Move[]>
