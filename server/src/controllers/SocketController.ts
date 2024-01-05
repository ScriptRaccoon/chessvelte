import type {
	Chat_Message,
	Client_Event,
	Move_Info,
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
	constructor(
		private socket: Socket<Client_Event, Server_Event, {}, {}>,
		private io: Server<Client_Event, Server_Event, {}, {}>,
		private game: Game,
		private player: Player,
	) {}

	// AUXILIARY PRIVATE METHODS

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

	// PRIVATE METHODS

	private send_game_state(): void {
		this.send("game_state", this.game.state)
	}

	private send_start_messages(): void {
		const messages = this.game.player_group.start_messages
		if (!messages) return
		for (const msg of messages) {
			this.send("chat", { content: msg })
		}
	}

	private send_game_outcome(): void {
		const outcome = this.game.status.outcome
		if (!outcome) return
		this.send("outcome", outcome)
		this.send("chat", { content: outcome })
	}

	// PUBLIC METHODS

	public start(is_new: boolean) {
		this.socket.join(this.game.id)
		this.send_me("color", this.player.color)

		const action = is_new ? "connected" : "reconnected"
		const msg = `${this.player.name} has ${action}`
		this.send_others("toast", msg, "success")
		this.send("chat", { content: msg })

		if (is_new && this.game.status.is_playing) {
			this.send_start_messages()
		}

		this.send_game_state()
	}

	public execute_move(move: Move_Info): void {
		const player = this.game.player_group.get(this.socket.id)
		if (!player || !this.game.status.is_allowed_to_move(player.color)) return
		this.game.execute_move(move)
		this.send_game_state()
		this.send_game_outcome()
	}

	public resign(): void {
		const player = this.game.player_group.get(this.socket.id)
		if (!this.game.status.is_playing || !player) return
		this.game.status.resign(player.color)
		this.send_game_state()
		this.send_game_outcome()
	}

	public offer_draw(): void {
		if (!this.game.status.is_playing || this.game.status.during_draw_offer)
			return
		this.game.status.initialize_draw()
		this.send_me("toast", "Draw has been offered", "info")
		this.send_others("offer_draw", this.player.name)
	}

	public reject_draw(): void {
		if (!this.game.status.is_playing) return
		this.send("toast", `${this.player.name} has rejected the draw`, "error")
		this.game.status.cancel_draw()
	}

	public accept_draw(): void {
		if (!this.game.status.is_playing) return
		this.game.status.draw()
		this.send_game_state()
		this.send_game_outcome()
		this.game.status.cancel_draw()
	}

	public restart(): void {
		if (!this.game.status.is_ended) return
		this.game.reset()
		this.game.player_group.switch_colors()
		this.send_game_state()
		this.send("toast", `${this.player.name} has restarted the game`, "info")
		this.send_start_messages()
		this.send_colors()
	}

	public send_colors(): void {
		for (const socket_id of this.game.player_group.keys) {
			const new_color = this.game.player_group.get(socket_id)!.color
			this.io.to(socket_id).emit("color", new_color)
		}
	}

	public chat(msg: Chat_Message): void {
		if (!msg.content || !msg.name) return
		this.send("chat", msg)
	}

	public handle_disconnect(): void {
		const msg = `${this.player.name ?? "Player"} has disconnected`
		this.game.status.cancel_draw()
		this.send("toast", msg, "error")
		this.send_others("chat", { content: msg })
		this.socket.leave(this.game.id)
	}
}
