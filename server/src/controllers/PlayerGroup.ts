import { get_other_color, get_random_color } from "$shared/utils"
import { Player } from "./Player"

export class PlayerGroup {
	private dictionary: Record<string, Player> = {}

	private get list(): Player[] {
		return Object.values(this.dictionary)
	}

	private get size(): number {
		return this.list.length
	}

	public get is_full(): boolean {
		return this.size === 2
	}

	public get keys(): string[] {
		return Object.keys(this.dictionary)
	}

	private get white_player(): Player | null {
		return this.list.find((player) => player.color === "white") ?? null
	}

	private get black_player(): Player | null {
		return this.list.find((player) => player.color === "black") ?? null
	}

	public get player_names(): [string, string] {
		return [this.white_player?.name ?? "?", this.black_player?.name ?? "?"]
	}

	public get_by_id(id: string): Player {
		return this.dictionary[id]
	}

	private remove_by_id(id: string): void {
		delete this.dictionary[id]
	}

	private set(id: string, player: Player): void {
		this.dictionary[id] = player
	}

	public add(
		socket_id: string,
		client_id: string,
		name: string,
	): { success: boolean; is_new: boolean } {
		const old_socket_id = this.keys.find(
			(id) => this.get_by_id(id).client_id === client_id,
		)

		if (old_socket_id) {
			const old_player = this.get_by_id(old_socket_id)
			this.remove_by_id(old_socket_id)
			old_player.set_name(name)
			this.set(socket_id, old_player)
			return { success: true, is_new: false }
		}

		if (this.size >= 2) return { success: false, is_new: false }

		let new_player: Player

		if (this.size === 0) {
			const color = get_random_color()
			new_player = new Player(client_id, color, name)
		} else {
			const color = get_other_color(this.list[0].color)
			new_player = new Player(client_id, color, name)
		}

		this.set(socket_id, new_player)

		return { success: true, is_new: true }
	}

	public switch_colors(): void {
		for (const player of this.list) {
			player.switch_color()
		}
	}

	public get start_messages(): string[] | null {
		const msg1 = "Game has started"
		const white_player = this.white_player
		const black_player = this.black_player
		if (!white_player || !black_player) return null
		const msg2 = `${white_player.name} plays White`
		const msg3 = `${black_player.name} plays Black`
		return [msg1, msg2, msg3]
	}
}
