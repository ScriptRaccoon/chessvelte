import type { Game_State } from "$lib/types"

export type Player = {
	id: string,
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

	add_player(id: string): Player | null {
		let player = this.players.find(player => player.id === id)
		if (player) 
			return player
		
		if (this.ready || this.started) 
			return null

		const turn = this.players.length === 0 ? Number(Math.random() < 0.5) : 1 - this.players[0].turn
	
		player = {id, turn}	
		this.players.push(player)

		return player
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
