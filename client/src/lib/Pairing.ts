import { SimpleDB } from "$shared/SimpleDB"

type Client_ID = string
type Game_ID = string

/**
 * This class is responsible for keeping track of which clients are paired together.
 * In particular, it prevents clients from joining a game that already has two players.
 */
export class Pairing {
	private static db = new SimpleDB<Pairing>()

	public static get_or_create_by_id(id: string): Pairing {
		if (Pairing.db.has(id)) return this.db.get(id)!
		return new Pairing(id)
	}

	public static exists(id: Game_ID): boolean {
		return this.db.has(id)
	}

	public static get(id: Game_ID): Pairing | undefined {
		return this.db.get(id)
	}

	public static clear(): void {
		this.db.clear()
	}

	constructor(
		id: Game_ID,
		private players: Client_ID[] = [],
	) {
		Pairing.db.add(id, this)
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
