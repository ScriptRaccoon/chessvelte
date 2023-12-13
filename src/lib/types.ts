export type server_to_client_event = {
	game_state: (counter: number, turn: number, started: boolean) => void,
	turn: (_:number) => void,
	ready: () => void,
	start: () => void
}

export type client_to_server_event = {
	me: (game_id: string, client_id: string) => void
	increment: (game_id: string) => void
	decrement: (game_id: string) => void,
	start: (game_id: string) => void
}
