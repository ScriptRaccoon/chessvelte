export type Player = {
	id: string
	name: string
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

	add_player(player: Player): void {
		this.players.push(player)
	}

	has_player(player_id: string): boolean {
		return this.players.some((player) => player.id === player_id)
	}

	get is_full(): boolean {
		return this.players.length >= 2
	}
}
