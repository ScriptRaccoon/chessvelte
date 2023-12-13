export type server_to_client_event = {
	message: (msg: string) => void
	game_state: (counter: number, turn: number) => void,
	turn: (_:number) => void
}

export type client_to_server_event = {
	me: (game_id: string, client_id: string) => void
	increment: (game_id: string) => void
	decrement: (game_id: string) => void
}
