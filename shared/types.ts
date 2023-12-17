export type toast_variant = "info" | "success" | "error"

export type Coord = [number, number]

export type Coord_Key = `${number}${number}`

export type Color = "black" | "white"

export type Player = {
	client_id: string
	turn: number
	color: Color
}

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
	| "check"
	| "checkmate"
	| "stalemate"
	| "resigned"
	| "promotion"

export type Game_State = {
	current_color: Color
	selected_coord: Coord | null
	possible_targets: Coord[]
	board_map: Board_Map
	status: GAME_STATUS
	captured_pieces: Piece_Display[]
	is_started: boolean
	is_ended: boolean
	outcome: string
	colors: Record<string, Color>
}

export type server_to_client_event = {
	game_state: (state: Game_State) => void
	toast: (msg: string, variant: toast_variant) => void
}

export type client_to_server_event = {
	me: (game_id: string, client_id: string) => void
	select: (game_id: string, coord: Coord) => void
	restart: (game_id: string) => void
	resign: (game_id: string) => void
	finish_promotion: (game_id: string, type: PIECE_TYPE) => void
	cancel_promotion: (game_id: string) => void
}
