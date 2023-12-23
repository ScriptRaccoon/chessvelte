export type Toast_Variant = "info" | "success" | "error"

export type Coord = [number, number]

export type Coord_Key = `${number}${number}`

export type Color = "black" | "white"

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
	| "promotion"
	| "drawn"
	| `checkmate-${Color}`
	| `resigned-${Color}`
	| "stalemate"

export type Game_State = {
	current_color: Color
	selected_coord: Coord | null
	possible_targets: Coord[]
	board_state: Board_State
	status: Game_Status
	captured_pieces: Piece_State[]
	is_started: boolean
	is_ended: boolean
	is_playing: boolean
	outcome: string
	player_names: [string, string] | null
}

export type Chat_Message = {
	name: string
	content: string
	bot: boolean
}

export type Server_Event = {
	game_state: (state: Game_State) => void
	toast: (msg: string, variant: Toast_Variant) => void
	offer_draw: (name: string) => void
	your_color: (color: Color) => void
	chat: (msg: Chat_Message) => void
}

export type Client_Event = {
	me: (game_id: string, client_id: string, name: string) => void
	select: (coord: Coord) => void
	restart: () => void
	resign: () => void
	offer_draw: () => void
	accept_draw: () => void
	reject_draw: () => void
	finish_promotion: (type: Piece_Type) => void
	cancel_promotion: () => void
	chat: (msg: Chat_Message & { bot: false }) => void
}
