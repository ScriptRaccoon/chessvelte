type player_id = string
type game_id = string

export class Pairing {
	static dictionary: Record<game_id, Pairing> = {}

	static exists(id: game_id): boolean {
		return id in Pairing.dictionary
	}

	static get_by_id(id: game_id): Pairing | undefined {
		return Pairing.dictionary[id]
	}

	constructor(
		public id: game_id,
		public players: player_id[] = []
	) {
		Pairing.dictionary[id] = this
	}

	add_player(player_id: player_id): player_id {
		this.players.push(player_id)
		return player_id
	}

	get_player(player_id: string): player_id | undefined {
		return this.players.find((id) => id === player_id)
	}

	get is_full(): boolean {
		return this.players.length >= 2
	}
}
