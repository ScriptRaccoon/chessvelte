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
		public turn: number = 0
	) {
		Game.dictionary[id] = this
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
