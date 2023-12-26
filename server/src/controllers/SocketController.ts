import {
	Chat_Message,
	Client_Event,
	Coord,
	Piece_Type,
	Server_Event,
} from "$shared/types"
import type { Game } from "./Game"
import type { Server, Socket } from "socket.io"
import type { Player } from "./Player"

/**
 * This class is responsible for handling all events for a given socket.
 * It connects the server with the methods in Game class.
 */
export class SocketController {
	private player: Player

	constructor(
		private socket: Socket<Client_Event, Server_Event, {}, {}>,
		private io: Server<Client_Event, Server_Event, {}, {}>,
		private game: Game,
	) {
		this.player = this.game.get_player(socket.id)
	}

	public start(is_new: boolean) {
		this.socket.join(this.game.id)
		this.send_me("color", this.player.color)

		const action = is_new ? "connected" : "reconnected"
		const msg = `${this.player.name} has ${action}`
		this.send_others("toast", msg, "success")
		this.send("chat", { content: msg })

		if (is_new && this.game.is_playing) {
			this.send_start_messages()
		}

		this.send_game_state()
	}

	private send<T extends keyof Server_Event>(
		event: T,
		...data: Parameters<Server_Event[T]>
	): void {
		this.io.to(this.game.id).emit(event, ...data)
	}

	private send_me<T extends keyof Server_Event>(
		event: T,
		...data: Parameters<Server_Event[T]>
	) {
		this.socket.emit(event, ...data)
	}

	private send_others<T extends keyof Server_Event>(
		event: T,
		...data: Parameters<Server_Event[T]>
	) {
		this.socket.broadcast.to(this.game.id).emit(event, ...data)
	}

	private may_move(): boolean {
		return this.game.is_allowed_to_move(this.socket.id)
	}

	private send_game_state(): void {
		this.send("game_state", this.game.state)
	}

	private send_start_messages(): void {
		if (!this.game.start_messages) return
		for (const msg of this.game.start_messages) {
			this.send("chat", { content: msg })
		}
	}

	private send_game_outcome(): void {
		if (!this.game.outcome) return
		this.send("outcome", this.game.outcome)
		this.send("chat", { content: this.game.outcome })
	}

	public resign(): void {
		if (!this.game.is_playing) return
		this.game.resign(this.socket.id)
		this.send_game_state()
		this.send_game_outcome()
	}

	public offer_draw(): void {
		if (!this.game.is_playing) return
		this.send_me("toast", "Draw has been offered", "info")
		this.send_others("offer_draw", this.player.name)
	}

	public reject_draw(): void {
		if (!this.game.is_playing) return
		this.send("toast", `${this.player.name} has rejected the draw`, "error")
	}

	public accept_draw(): void {
		if (!this.game.is_playing) return
		this.game.draw()
		this.send_game_state()
		this.send_game_outcome()
	}

	public select(coord: Coord): void {
		if (!this.may_move()) return
		const actionable = this.game.select_coord(coord)
		this.send_me("selection", this.game.selection)
		if (actionable) {
			this.send_game_state()
			this.send_game_outcome()
		} else if (this.game.during_promotion) {
			this.send_me("open_promotion_modal")
		}
	}

	public restart(): void {
		if (!this.game.is_ended) return
		this.game.reset()
		this.game.switch_player_colors()
		this.send_game_state()
		this.send("toast", `${this.player.name} has restarted the game`, "info")
		this.send_start_messages()
		this.send_new_colors()
	}

	public send_new_colors(): void {
		for (const socket_id of this.game.list_of_sockets()) {
			const new_color = this.game.get_player(socket_id).color
			this.io.to(socket_id).emit("color", new_color)
		}
	}

	public cancel_promotion(): void {
		if (!this.may_move()) return
		this.game.cancel_promotion()
	}

	public finish_promotion(type: Piece_Type): void {
		if (!this.may_move()) return
		this.game.finish_promotion(type)
		this.send_game_state()
	}

	public chat(msg: Chat_Message): void {
		if (!msg.content || !msg.name) return
		this.send("chat", msg)
	}

	public handle_disconnect(): void {
		if (this.may_move()) this.game.cancel_promotion()
		const msg = `${this.player.name ?? "Player"} has disconnected`
		this.send("toast", msg, "error")
		this.send_others("chat", { content: msg })
		this.socket.leave(this.game.id)
	}
}
