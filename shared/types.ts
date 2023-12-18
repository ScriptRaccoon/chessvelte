export type toast_variant = "info" | "success" | "error"

export type login_error = "name" | "gameid" | ""

export type Coord = [number, number]

export type Coord_Key = `${number}${number}`

export type Color = "black" | "white"

export type PIECE_TYPE =
	| "pawn"
	| "rook"
	| "knight"
	| "bishop"
	| "queen"
	| "king"

export type Piece_Display = {
	type: PIECE_TYPE
	color: Color
	value: number
}

export type Board_Map = Record<Coord_Key, Piece_Display>

export type GAME_STATUS =
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
	board_map: Board_Map
	status: GAME_STATUS
	captured_pieces: Piece_Display[]
	is_started: boolean
	is_ended: boolean
	is_playing: boolean
	outcome: string
	player_names: [string, string] | null
}

export type server_to_client_event = {
	game_state: (state: Game_State) => void
	toast: (msg: string, variant: toast_variant) => void
	offer_draw: (name: string) => void
	your_color: (color: Color) => void
}

export type client_to_server_event = {
	me: (game_id: string, client_id: string, name: string) => void
	select: (coord: Coord) => void
	restart: () => void
	resign: () => void
	offer_draw: () => void
	accept_draw: () => void
	reject_draw: () => void
	finish_promotion: (type: PIECE_TYPE) => void
	cancel_promotion: () => void
}
