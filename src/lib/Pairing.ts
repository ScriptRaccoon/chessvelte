export type Player = {
	id: string
	turn: number
}

export class Pairing {
	static dictionary: Record<string, Pairing> = {}

	static exists(id: string): boolean {
		return id in Pairing.dictionary
	}

	static get_by_id(id: string): Pairing | undefined {
		return Pairing.dictionary[id]
	}

	constructor(
		public id: string,
		public players: Player[] = []
	) {
		Pairing.dictionary[id] = this
	}

	add_player(player_id: string): Player {
		let turn: number
		if (this.players.length === 0) {
			turn = Number(Math.random() < 0.5)
		} else {
			turn = 1 - this.players[0].turn
		}
		const player = {
			id: player_id,
			turn
		}
		this.players.push(player)
		return player
	}

	get_player(player_id: string): Player | undefined {
		return this.players.find((player) => player.id === player_id)
	}

	get is_full(): boolean {
		return this.players.length >= 2
	}
}
