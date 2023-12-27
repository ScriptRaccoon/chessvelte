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

export type Piece_State = {
	type: Piece_Type
	color: Color
	value: number
}

export type Board_State = Record<Coord_Key, Piece_State>

export type Move_State = {
	start: Coord
	end: Coord
	type: Move_Type
	promotion_choice?: Piece_Type
}

export type Possible_Moves_State = Record<Coord_Key, Move_State[]>

export type Game_Status =
	| "waiting"
	| "playing"
	| "drawn"
	| `checkmate-${Color}`
	| `resigned-${Color}`
	| "stalemate"

export type Game_State = {
	current_color: Color
	board_state: Board_State
	captured_pieces: Piece_State[]
	is_started: boolean
	is_ended: boolean
	player_names: [string, string] | null
	last_move: Move_State | null
	possible_moves: Possible_Moves_State
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
	move: (move: Move_State) => void
	join: (game_id: string, client_id: string, name: string) => void
	restart: () => void
	resign: () => void
	offer_draw: () => void
	accept_draw: () => void
	reject_draw: () => void
	chat: (msg: Chat_Message) => void
}
