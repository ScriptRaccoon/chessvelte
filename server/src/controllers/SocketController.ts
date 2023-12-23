import {
	Chat_Message,
	Client_Event,
	Coord,
	Piece_Type,
	Server_Event,
} from "$shared/types"
import { Player_Socket, Socket_Data } from "../types.server"
import { Game } from "./Game"
import { Server } from "socket.io"

export class SocketController {
	constructor(private io: Server<Client_Event, Server_Event, {}, Socket_Data>) {
		this.io.on("connection", (socket) => {
			socket.on("join", (...data) => this.join(socket, ...data))
			socket.on("resign", () => this.resign(socket))
			socket.on("offer_draw", () => this.offer_draw(socket))
			socket.on("reject_draw", () => this.reject_draw(socket))
			socket.on("accept_draw", () => this.accept_draw(socket))
			socket.on("select", (coord) => this.select(socket, coord))
			socket.on("restart", () => this.restart(socket))
			socket.on("cancel_promotion", () => this.cancel_promotion(socket))
			socket.on("finish_promotion", (type) =>
				this.finish_promotion(socket, type),
			)
			socket.on("disconnect", () => this.disconnect(socket))
			socket.on("chat", (msg) => this["chat"](socket, msg))
		})
	}

	private join(
		socket: Player_Socket,
		game_id: string,
		client_id: string,
		name: string,
	) {
		const game = Game.get_by_id(game_id) ?? new Game(game_id)
		const player_info = game.add_player(socket.id, client_id, name)
		if (!player_info) return
		socket.join(game_id)
		socket.data.game_id = game_id
		const { is_new, player } = player_info
		const action = is_new ? "connected" : "reconnected"
		socket.broadcast
			.to(game.id)
			.emit("toast", `${player.name} has ${action}`, "success")
		this.emit_game_state(game)
		socket.emit("your_color", player.color)

		socket.broadcast.to(game.id).emit("chat", {
			content: `${player.name} has ${action}`,
		})

		if (is_new && game.is_playing && game.start_messages) {
			this.send_start_messages(game)
		}
	}

	private resign(socket: Player_Socket): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_playing) return
		game.resign(socket.id)
		this.emit_game_state(game)
		this.send_game_outcome(game)
	}

	private offer_draw(socket: Player_Socket): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_playing) return
		const player = game.get_player(socket.id)
		socket.emit("toast", "Draw has been offered", "info")
		socket.broadcast.to(game.id).emit("offer_draw", player.name)
	}

	private reject_draw(socket: Player_Socket): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_playing) return
		const player = game.get_player(socket.id)
		this.io
			.to(game.id)
			.emit("toast", `${player.name} has rejected the draw`, "error")
	}

	private accept_draw(socket: Player_Socket): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_playing) return
		game.draw()
		this.emit_game_state(game)
		this.send_game_outcome(game)
	}

	private select(socket: Player_Socket, coord: Coord): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_playing) return
		if (!game.is_allowed_to_move(socket.id)) return
		const actionable = game.select_coord(coord)
		if (actionable) {
			this.emit_game_state(game)
			if (game.outcome) {
				this.send_game_outcome(game)
			}
		} else {
			socket.emit("game_state", game.state)
		}
	}

	private restart(socket: Player_Socket): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_ended) return
		game.reset()
		game.switch_player_colors()
		this.emit_game_state(game)

		const player = game.get_player(socket.id)
		this.io
			.to(game.id)
			.emit("toast", `${player.name} has restarted the game`, "info")

		this.send_start_messages(game)

		for (const socket_id of game.list_of_sockets()) {
			const new_color = game.get_player(socket_id).color
			this.io.to(socket_id).emit("your_color", new_color)
		}
	}

	private emit_404(socket: Player_Socket): void {
		socket.emit("toast", "Game cannot be found", "error")
	}

	private emit_game_state(game: Game): void {
		this.io.to(game.id).emit("game_state", game.state)
	}

	private send_game_outcome(game: Game): void {
		this.io.to(game.id).emit("outcome", game.outcome)
		this.io.to(game.id).emit("chat", {
			content: game.outcome,
		})
	}

	private send_start_messages(game: Game): void {
		if (!game.start_messages) return
		for (const msg of game.start_messages) {
			this.io.to(game.id).emit("chat", {
				content: msg,
			})
		}
	}

	private cancel_promotion(socket: Player_Socket): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_playing) return
		game.cancel_promotion()
		this.emit_game_state(game)
	}

	private finish_promotion(socket: Player_Socket, type: Piece_Type): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return this.emit_404(socket)
		if (!game.is_playing) return
		game.finish_promotion(type)
		this.emit_game_state(game)
	}

	private disconnect(socket: Player_Socket): void {
		const game = this.get_game_of_socket(socket)
		if (!game) return
		const player = game.get_player(socket.id)
		const name = player?.name ?? "Player"
		this.io.to(game.id).emit("toast", `${name} has disconnected`, "error")
		socket.leave(game.id)

		socket.broadcast.to(game.id).emit("chat", {
			content: `${name} has disconnected`,
		})
	}

	private chat(socket: Player_Socket, msg: Chat_Message): void {
		const game_id = socket.data.game_id
		if (!game_id || !msg.content) return
		this.io.to(game_id).emit("chat", { content: msg.content })
	}

	private get_game_of_socket(socket: Player_Socket): Game | undefined {
		return Game.get_by_id(socket.data.game_id ?? "")
	}
}
