export type Toast_Variant = "info" | "success" | "error"

export type Coord = [number, number]

export type Coord_Key = `${number}${number}`

export type Color = "black" | "white"

export type Move_Type = "regular" | "en passant" | "promotion" | "castle"

export type Piece_Type =
	| "pawn"
	| "rook"
	| "knight"
	| "bishop"
	| "queen"
	| "king"

export type Piece_Info = {
	type: Piece_Type
	color: Color
	value: number
	coord: Coord
	id: string
}

export type Move_Info = {
	start: Coord
	end: Coord
	type: Move_Type
	promotion_choice?: Piece_Type
}

export type Possible_Moves_Info = Record<Coord_Key, Move_Info[]>

export type Game_Status =
	| "waiting"
	| "playing"
	| "drawn"
	| `checkmate-${Color}`
	| `resigned-${Color}`
	| "stalemate"

export type Game_State = {
	current_color: Color
	pieces: Piece_Info[]
	captured_pieces: Piece_Info[]
	is_started: boolean
	is_ended: boolean
	player_names: [string, string] | null
	last_move: Move_Info | null
	possible_moves: Possible_Moves_Info
}

export type Chat_Message = {
	name?: string
	content: string
}

export type Server_Event = {
	game_state: (state: Game_State) => void
	toast: (msg: string, variant: Toast_Variant) => void
	offer_draw: (name: string) => void
	color: (color: Color) => void
	chat: (msg: Chat_Message) => void
	outcome: (msg: string) => void
}

export type Client_Event = {
	move: (move: Move_Info) => void
	join: (game_id: string, client_id: string, name: string) => void
	restart: () => void
	resign: () => void
	offer_draw: () => void
	accept_draw: () => void
	reject_draw: () => void
	chat: (msg: Chat_Message) => void
}
