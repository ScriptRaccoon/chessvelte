export type Player = {
	id: string
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
	
		const player = {
			id: player_id,
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
