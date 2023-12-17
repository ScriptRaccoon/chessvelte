import { Server } from "socket.io"
import express from "express"
import chalk from "chalk"
import dotenv from "dotenv"

import { client_to_server_event, server_to_client_event } from "$shared/types"
import { Game } from "./controllers/Game"

dotenv.config()

function log(...msg: any) {
	if (process.env.LOGGING) console.info(...msg)
}

const app = express()
const PORT = process.env.PORT ?? 5000

const server = app.listen(PORT, () => {
	console.info(chalk.cyan(`Server listening on port ${PORT}`))
})

const io = new Server<client_to_server_event, server_to_client_event>(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
	},
})

function emit_game_state(game: Game) {
	io.to(game.id).emit("game_state", game.state)
}

io.on("connection", (socket) => {
	log(socket.id, "has connected")

	/**
	 * Player joins game
	 */
	socket.on("me", (game_id, client_id) => {
		log(socket.id, "wants to join", game_id)
		const game = Game.get_by_id(game_id) ?? new Game(game_id)
		const player_info = game.add_player(socket.id, client_id)
		if (!player_info) return
		socket.join(game_id)
		log(socket.id, "joined game", game_id)
		const action = player_info.is_new ? "connected" : "reconnected"
		socket.broadcast
			.to(game.id)
			.emit("toast", `Player has ${action}`, "success")
		emit_game_state(game)
	})

	/**
	 * Select coordinate for move
	 */
	socket.on("select", (game_id, coord) => {
		log(socket.id, "selects", coord, "in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_playing) return
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
	socket.on("resign", (game_id) => {
		log(socket.id, "resigns in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_playing) return
		game.resign(socket.id)
		emit_game_state(game)
	})

	/**
	 * Restart game
	 */
	socket.on("restart", (game_id) => {
		log(socket.id, "restarts", "in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_ended) return
		game.reset()
		emit_game_state(game)
		io.to(game.id).emit("toast", "Restarted game", "info")
	})

	/**
	 * Offer draw
	 */
	socket.on("offer_draw", (game_id) => {
		log(socket.id, "offers draw in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_playing) return
		socket.emit("toast", "Draw has been offered", "info")
		socket.broadcast.to(game.id).emit("offer_draw")
	})

	/**
	 * Reject draw
	 */

	socket.on("reject_draw", (game_id) => {
		log(socket.id, "rejects draw in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_playing) return
		io.to(game.id).emit("toast", "Draw has been rejected", "error")
	})

	/**
	 * Accept draw
	 */
	socket.on("accept_draw", (game_id) => {
		log(socket.id, "accepts draw in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_playing) return
		game.draw()
		emit_game_state(game)
	})

	/**
	 * Cancel promotion
	 */
	socket.on("cancel_promotion", (game_id) => {
		log(socket.id, "cancels promotion in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_playing) return
		game.cancel_promotion()
		emit_game_state(game)
	})

	/**
	 * Finish promotion
	 */
	socket.on("finish_promotion", (game_id, type) => {
		log(socket.id, "promotes with", type, "in game", game_id)
		const game = Game.get_by_id(game_id)
		if (!game?.is_playing) return
		game.finish_promotion(type)
		emit_game_state(game)
	})

	/**
	 * Handle disconnection
	 */
	socket.on("disconnect", () => {
		log(socket.id, "has disconnected")
		const game = Game.find_by_player(socket.id)
		if (!game) return
		io.to(game.id).emit("toast", "Player has disconnected", "error")
		socket.leave(game.id)
	})
})
