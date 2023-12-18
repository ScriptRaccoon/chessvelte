import { Server, type Socket } from "socket.io"
import express from "express"
import chalk from "chalk"
import dotenv from "dotenv"

import { client_to_server_event, server_to_client_event } from "$shared/types"
import { Game } from "./controllers/Game"
import { socket_data } from "./types.server"

dotenv.config()

function log(...msg: any) {
	if (process.env.LOGGING) console.info(...msg)
}

const app = express()
const PORT = process.env.PORT ?? 5000

const server = app.listen(PORT, () => {
	console.info(chalk.cyan(`Server listening on port ${PORT}`))
})

const io = new Server<
	client_to_server_event,
	server_to_client_event,
	{},
	socket_data
>(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
	},
})

function emit_game_state(game: Game) {
	io.to(game.id).emit("game_state", game.state)
}

function get_game_of_socket(
	socket: Socket<
		client_to_server_event,
		server_to_client_event,
		{},
		socket_data
	>,
): Game | undefined {
	return Game.get_by_id(socket.data.game_id ?? "")
}

io.on("connection", (socket) => {
	log(socket.id, "has connected")

	/**
	 * Player joins game
	 */
	socket.on("me", (game_id, client_id, name) => {
		log(socket.id, "wants to join", game_id)
		const game = Game.get_by_id(game_id) ?? new Game(game_id)
		const player_info = game.add_player(socket.id, client_id, name)
		if (!player_info) return
		socket.join(game_id)
		socket.data.game_id = game_id
		const { is_new, player } = player_info
		log(socket.id, "with name", player.name, "joined game", game_id)
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
		if (!game?.is_playing) return
		if (!game.is_allowed_to_move(socket.id)) return
		log(socket.id, "selects", coord, "in game", game.id)
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
		if (!game?.is_playing) return
		log(socket.id, "resigns in game", game.id)
		game.resign(socket.id)
		emit_game_state(game)
	})

	/**
	 * Restart game
	 */
	socket.on("restart", () => {
		const game = get_game_of_socket(socket)
		if (!game?.is_ended) return
		log(socket.id, "restarts", "in game", game.id)
		game.reset()
		game.switch_player_colors()
		emit_game_state(game)

		const player = game.get_player_by_socket(socket.id)
		io.to(game.id).emit(
			"toast",
			`${player.name} has restarted the game`,
			"info",
		)

		for (const socket_id in game.socket_list) {
			io.to(socket_id).emit(
				"your_color",
				game.get_player_by_socket(socket_id).color,
			)
		}
	})

	/**
	 * Offer draw
	 */
	socket.on("offer_draw", () => {
		const game = get_game_of_socket(socket)
		if (!game?.is_playing) return
		log(socket.id, "offers draw in game", game.id)
		const player = game.get_player_by_socket(socket.id)
		socket.emit("toast", "Draw has been offered", "info")
		socket.broadcast.to(game.id).emit("offer_draw", player.name)
	})

	/**
	 * Reject draw
	 */

	socket.on("reject_draw", () => {
		const game = get_game_of_socket(socket)
		if (!game?.is_playing) return
		log(socket.id, "rejects draw in game", game.id)
		const player = game.get_player_by_socket(socket.id)
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
		if (!game?.is_playing) return
		log(socket.id, "accepts draw in game", game.id)
		game.draw()
		emit_game_state(game)
	})

	/**
	 * Cancel promotion
	 */
	socket.on("cancel_promotion", () => {
		const game = get_game_of_socket(socket)
		if (!game?.is_playing) return
		log(socket.id, "cancels promotion in game", game.id)
		game.cancel_promotion()
		emit_game_state(game)
	})

	/**
	 * Finish promotion
	 */
	socket.on("finish_promotion", (type) => {
		const game = get_game_of_socket(socket)
		if (!game?.is_playing) return
		log(socket.id, "promotes with", type, "in game", game.id)
		game.finish_promotion(type)
		emit_game_state(game)
	})

	/**
	 * Handle disconnection
	 */
	socket.on("disconnect", () => {
		log(socket.id, "has disconnected")
		const game = get_game_of_socket(socket)
		if (!game) return
		const player = game.get_player_by_socket(socket.id)
		const name = player?.name ?? "Player"
		io.to(game.id).emit("toast", `${name} has disconnected`, "error")
		socket.leave(game.id)
	})
})
