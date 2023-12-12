export type server_to_client_event = {
	message: (_: string) => void
	counter: (_: number) => void
}

export type client_to_server_event = {
	counter: (_: number) => void
}

export type Player = {
	id: string
	name: string
}

export type Game = {
	id: string
	players: Player[]
	counter: number
}
