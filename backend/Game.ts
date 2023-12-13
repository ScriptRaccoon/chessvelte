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

	add_player(client_id: string): void {
		if (this.is_full) return
		if (this.players.some(player => player.id === client_id)) return
		const player = {
			id: client_id,
			turn: this.players.length === 0 ? Number(Math.random() < 0.5) : 1 - this.players[0].turn
		}	
		this.players.push(player)
		console.log("players in game",this.players);
	}

	get is_full():boolean {
		return this.players.length >= 2
	}

	increment_counter() {
		this.counter++
		this.switch_turn()
	}

	decrement_counter() {
		this.counter--
		this.switch_turn()
	}

	switch_turn() {
		this.turn = 1 - this.turn
	}
}
