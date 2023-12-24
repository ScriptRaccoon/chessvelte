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

export class PlayerSocket {
	private player: Player

	constructor(
		private socket: Socket<Client_Event, Server_Event, {}, {}>,
		private io: Server<Client_Event, Server_Event, {}, {}>,
		private game: Game,
	) {
		this.player = this.game.get_player(socket.id)
	}

	private get id(): string {
		return this.socket.id
	}

	private get name(): string {
		return this.player.name
	}

	private emit_game_state(): void {
		this.io.to(this.game.id).emit("game_state", this.game.state)
	}

	private send_start_messages(): void {
		if (!this.game.start_messages) return
		for (const msg of this.game.start_messages) {
			this.io.to(this.game.id).emit("chat", {
				content: msg,
			})
		}
	}

	private send_game_outcome(): void {
		this.io.to(this.game.id).emit("outcome", this.game.outcome)
		this.io.to(this.game.id).emit("chat", {
			content: this.game.outcome,
		})
	}

	public start(is_new: boolean) {
		this.socket.join(this.game.id)
		const action = is_new ? "connected" : "reconnected"
		this.socket.broadcast
			.to(this.game.id)
			.emit("toast", `${this.name} has ${action}`, "success")
		this.emit_game_state()
		this.socket.emit("your_color", this.player.color)

		this.socket.broadcast.to(this.game.id).emit("chat", {
			content: `${this.name} has ${action}`,
		})

		if (is_new && this.game.is_playing && this.game.start_messages) {
			this.send_start_messages()
		}
	}

	public resign(): void {
		if (!this.game.is_playing) return
		this.game.resign(this.id)
		this.emit_game_state()
		this.send_game_outcome()
	}

	public offer_draw(): void {
		if (!this.game.is_playing) return
		this.socket.emit("toast", "Draw has been offered", "info")
		this.socket.broadcast.to(this.game.id).emit("offer_draw", this.name)
	}

	public reject_draw(): void {
		if (!this.game.is_playing) return
		this.io
			.to(this.game.id)
			.emit("toast", `${this.name} has rejected the draw`, "error")
	}

	public accept_draw(): void {
		if (!this.game.is_playing) return
		this.game.draw()
		this.emit_game_state()
		this.send_game_outcome()
	}

	public select(coord: Coord): void {
		if (!this.game.is_playing) return
		if (!this.game.is_allowed_to_move(this.id)) return
		const actionable = this.game.select_coord(coord)
		if (actionable) {
			this.emit_game_state()
			if (this.game.outcome) {
				this.send_game_outcome()
			}
		} else {
			this.socket.emit("game_state", this.game.state)
		}
	}

	public restart(): void {
		if (!this.game.is_ended) return
		this.game.reset()
		this.game.switch_player_colors()
		this.emit_game_state()

		this.io
			.to(this.game.id)
			.emit("toast", `${this.name} has restarted the game`, "info")

		this.send_start_messages()

		for (const socket_id of this.game.list_of_sockets()) {
			const new_color = this.game.get_player(socket_id).color
			this.io.to(socket_id).emit("your_color", new_color)
		}
	}

	public cancel_promotion(): void {
		if (!this.game.is_playing) return
		this.game.cancel_promotion()
		this.emit_game_state()
	}

	public finish_promotion(type: Piece_Type): void {
		if (!this.game.is_playing) return
		this.game.finish_promotion(type)
		this.emit_game_state()
	}

	public chat(msg: Chat_Message): void {
		if (!msg.content || !msg.name) return
		this.io.to(this.game.id).emit("chat", msg)
	}

	public disconnect(): void {
		this.io
			.to(this.game.id)
			.emit("toast", `${this.name} has disconnected`, "error")
		this.socket.leave(this.game.id)
		this.socket.broadcast.to(this.game.id).emit("chat", {
			content: `${this.name} has disconnected`,
		})
	}
}
