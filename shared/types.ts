export type Toast_Variant = "info" | "success" | "error"

export type Login_Error = "name" | "gameid" | ""

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

export type Piece_Display = {
	type: Piece_Type
	color: Color
	value: number
}

export type Board_Map = Record<Coord_Key, Piece_Display>

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
	board_map: Board_Map
	status: Game_Status
	captured_pieces: Piece_Display[]
	is_started: boolean
	is_ended: boolean
	is_playing: boolean
	outcome: string
	player_names: [string, string] | null
}

export type Server_Event = {
	game_state: (state: Game_State) => void
	toast: (msg: string, variant: Toast_Variant) => void
	offer_draw: (name: string) => void
	your_color: (color: Color) => void
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
}
