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
		public counter: number = 0
	) {
		Game.dictionary[id] = this
	}

	increment() {
		this.counter++
	}

	decrement() {
		this.counter--
	}
}
