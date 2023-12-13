// frontend types

export type Game_State = {
	counter: number
	ready: boolean
	started: boolean
	turn: number
}

export type server_to_client_event = {
	game_state: (state: Game_State) => void
	turn: (_: number) => void
	alert: (msg: string) => void
}

export type client_to_server_event = {
	me: (game_id: string, client_id: string) => void
	increment: (game_id: string) => void
	decrement: (game_id: string) => void
	start: (game_id: string) => void
}

export type PIECE_TYPE =
	| "pawn"
	| "rook"
	| "knight"
	| "bishop"
	| "queen"
	| "king"

export type Coord = [number, number]

export type Color = "black" | "white"
