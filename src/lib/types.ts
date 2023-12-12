export type server_to_client_event = {
	message: (_: string) => void
	game_state: (counter: number, turn: number) => void
}

export type client_to_server_event = {
	game_id: (_: string) => void
	increment: (game_id: string) => void
	decrement: (game_id: string) => void
}
