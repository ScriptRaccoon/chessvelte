export type Toast_Variant = "info" | "success" | "error"

export type Coord = [number, number]

export type Coord_Key = `${number}${number}`

export type Color = "black" | "white"

export type Move_State = {
	start: Coord
	end: Coord
}

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

export type Located_Piece_State = Piece_State & { coord: Coord }

export type Board_State = Located_Piece_State[]

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
	status: Game_Status
	captured_pieces: Piece_State[]
	is_started: boolean
	is_ended: boolean
	is_playing: boolean
	player_names: [string, string] | null
	last_move: Move_State | null
}

export type Coord_Selection = {
	selected_coord: Coord | null
	possible_targets: Coord[]
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
	open_promotion_modal: () => void
	selection: (selection: Coord_Selection) => void
}

export type Client_Event = {
	join: (game_id: string, client_id: string, name: string) => void
	select: (coord: Coord) => void
	restart: () => void
	resign: () => void
	offer_draw: () => void
	accept_draw: () => void
	reject_draw: () => void
	finish_promotion: (type: Piece_Type) => void
	cancel_promotion: () => void
	chat: (msg: Chat_Message) => void
}
