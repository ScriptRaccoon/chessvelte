type Client_ID = string
type Game_ID = string

export class Pairing {
	private static dictionary: Record<Game_ID, Pairing> = {}

	public static exists(id: Game_ID): boolean {
		return id in Pairing.dictionary
	}

	public static get_by_id(id: Game_ID): Pairing | undefined {
		return Pairing.dictionary[id]
	}

	public static clear(): void {
		Pairing.dictionary = {}
	}

	constructor(
		id: Game_ID,
		private players: Client_ID[] = [],
	) {
		Pairing.dictionary[id] = this
	}

	public add_player(client_id: Client_ID): void {
		if (this.is_full) return
		this.players.push(client_id)
	}

	public has_player(client_id: Client_ID): boolean {
		return this.players.some((id) => id === client_id)
	}

	public get_players(): Client_ID[] {
		return this.players
	}

	public get is_full(): boolean {
		return this.players.length == 2
	}
}
