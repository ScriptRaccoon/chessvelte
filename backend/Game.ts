import type { Game_State } from "$lib/types"

export type Player = {
	client_id: string,
	socket_id: string,
	turn: number
}

/**
 * temporary basic game class to test web socket communication
 */
export class Game {
	static dictionary: Record<string, Game> = {}

	static get_by_id(id: string): Game | undefined {
		return Game.dictionary[id]
	}

	constructor(
		public id: string,
		public counter: number = 0,
		public turn: number = 0,
		public started: boolean = false,
		public players: Player[] = []
	) {
		Game.dictionary[id] = this
	}

	get state(): Game_State {
		return {
			counter: this.counter,
			ready: this.ready,
			started: this.started,
			turn: this.turn
		}
	}

	start(): void {
		this.started = true
	}

	add_player(socket_id: string, client_id: string): Player | null {
		const player: Player | undefined = this.players.find(player => player.client_id === client_id)
		
		if (player) {
			player.socket_id = socket_id
			return player
		}
		
		if (this.ready || this.started) 
			return null

		const turn = this.players.length === 0 ? Number(Math.random() < 0.5) : 1 - this.players[0].turn
	
		const new_player: Player = {socket_id, client_id, turn}	
		this.players.push(new_player)

		return new_player
	}

	get ready(): boolean {
		return this.players.length === 2
	}

	increment_counter() {
		if (!this.started) return
		this.counter++
		this.switch_turn()
	}
	
	decrement_counter() {
		if (!this.started) return
		this.counter--
		this.switch_turn()
	}
	
	switch_turn() {
		if (!this.started) return
		this.turn = 1 - this.turn
	}
}
