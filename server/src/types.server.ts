import { Coord, Piece_Type, Client_Event, Server_Event } from "$shared/types"
import { type Socket } from "socket.io"
import { Piece } from "./controllers/Piece"

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

export type Socket_Data = {
	game_id: string
}

export type Player_Socket = Socket<Client_Event, Server_Event, {}, Socket_Data>
