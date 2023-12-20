import { Server, type Socket } from "socket.io"
import express from "express"
import chalk from "chalk"
import dotenv from "dotenv"

import { Client_Event, Server_Event } from "$shared/types"
import { Game } from "./controllers/Game"
import { Player_Socket, Socket_Data } from "./types.server"

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 5000

const server = app.listen(PORT, () => {
	console.info(chalk.cyan(`Server listening on port ${PORT}`))
})

const io = new Server<Client_Event, Server_Event, {}, Socket_Data>(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
	},
})

function emit_game_state(game: Game) {
	io.to(game.id).emit("game_state", game.state)
}

function emit_404(socket: Player_Socket): void {
	socket.emit("toast", "Game cannot be found", "error")
}

function get_game_of_socket(socket: Player_Socket): Game | undefined {
	return Game.get_by_id(socket.data.game_id ?? "")
}

io.on("connection", (socket) => {
	/**
	 * Player joins game
	 */
	socket.on("me", (game_id, client_id, name) => {
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
		emit_game_state(game)
		socket.emit("your_color", player.color)
	})

	/**
	 * Select coordinate for move
	 */
	socket.on("select", (coord) => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_playing) return
		if (!game.is_allowed_to_move(socket.id)) return
		const actionable = game.select_coord(coord)
		if (actionable) {
			emit_game_state(game)
		} else {
			socket.emit("game_state", game.state)
		}
	})

	/**
	 * Resign game
	 */
	socket.on("resign", () => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_playing) return
		game.resign(socket.id)
		emit_game_state(game)
	})

	/**
	 * Restart game
	 */
	socket.on("restart", () => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_ended) return
		game.reset()
		game.switch_player_colors()
		emit_game_state(game)

		const player = game.get_player(socket.id)
		io.to(game.id).emit(
			"toast",
			`${player.name} has restarted the game`,
			"info",
		)

		for (const socket_id of game.list_of_sockets()) {
			const new_color = game.get_player(socket_id).color
			io.to(socket_id).emit("your_color", new_color)
		}
	})

	/**
	 * Offer draw
	 */
	socket.on("offer_draw", () => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_playing) return
		const player = game.get_player(socket.id)
		socket.emit("toast", "Draw has been offered", "info")
		socket.broadcast.to(game.id).emit("offer_draw", player.name)
	})

	/**
	 * Reject draw
	 */

	socket.on("reject_draw", () => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_playing) return
		const player = game.get_player(socket.id)
		io.to(game.id).emit(
			"toast",
			`${player.name} has rejected the draw`,
			"error",
		)
	})

	/**
	 * Accept draw
	 */
	socket.on("accept_draw", () => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_playing) return
		game.draw()
		emit_game_state(game)
	})

	/**
	 * Cancel promotion
	 */
	socket.on("cancel_promotion", () => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_playing) return
		game.cancel_promotion()
		emit_game_state(game)
	})

	/**
	 * Finish promotion
	 */
	socket.on("finish_promotion", (type) => {
		const game = get_game_of_socket(socket)
		if (!game) return emit_404(socket)
		if (!game.is_playing) return
		game.finish_promotion(type)
		emit_game_state(game)
	})

	/**
	 * Handle disconnection
	 */
	socket.on("disconnect", () => {
		const game = get_game_of_socket(socket)
		if (!game) return
		const player = game.get_player(socket.id)
		const name = player?.name ?? "Player"
		io.to(game.id).emit("toast", `${name} has disconnected`, "error")
		socket.leave(game.id)
	})
})
