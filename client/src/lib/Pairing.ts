type Client_ID = string
type Game_ID = string

export class Pairing {
	static dictionary: Record<Game_ID, Pairing> = {}

	static exists(id: Game_ID): boolean {
		return id in Pairing.dictionary
	}

	static get_by_id(id: Game_ID): Pairing | undefined {
		return Pairing.dictionary[id]
	}

	constructor(
		public id: Game_ID,
		public players: Client_ID[] = [],
	) {
		Pairing.dictionary[id] = this
	}

	add_player(client_id: Client_ID): void {
		this.players.push(client_id)
	}

	has_player(client_id: Client_ID): boolean {
		return this.players.some((id) => id === client_id)
	}

	get is_full(): boolean {
		return this.players.length >= 2
	}
}
