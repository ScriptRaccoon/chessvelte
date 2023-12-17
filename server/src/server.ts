import { Server } from "socket.io"
import express from "express"
import chalk from "chalk"
import dotenv from "dotenv"

import { client_to_server_event, server_to_client_event } from "$shared/types"
import { Game } from "./controllers/Game"

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 5000

const server = app.listen(PORT, () => {
	console.log(chalk.cyan("Server listening on port ") + chalk.cyan.bold(PORT))
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
	socket.on("me", (game_id, client_id) => {
		socket.join(game_id)
		const game = Game.get_by_id(game_id) ?? new Game(game_id)
		const player = game.add_player(socket.id, client_id)
		if (!player) return
		socket.broadcast
			.to(game.id)
			.emit("toast", "Player has connected", "success")
		emit_game_state(game)
	})

	socket.on("select", (game_id, coord) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || game.is_ended) return
		if (game.players[socket.id].turn !== game.turn) return
		const actionable = game.select_coord(coord)
		if (actionable) {
			emit_game_state(game)
		} else {
			socket.emit("game_state", game.state)
		}
	})

	socket.on("resign", (game_id) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || game.is_ended) return
		game.resign(socket.id)
		emit_game_state(game)
	})

	socket.on("restart", (game_id) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || !game.is_ended) return
		game.reset()
		emit_game_state(game)
		io.to(game.id).emit("toast", "Restarted game", "info")
	})

	socket.on("offer_draw", (game_id) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || game.is_ended) return
		socket.emit("toast", "Draw has been offered", "info")
		socket.broadcast.to(game.id).emit("offer_draw")
	})

	socket.on("reject_draw", (game_id) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || game.is_ended) return
		io.to(game.id).emit("toast", "Draw has been rejected", "error")
	})

	socket.on("accept_draw", (game_id) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || game.is_ended) return
		game.draw()
		emit_game_state(game)
	})

	socket.on("cancel_promotion", (game_id) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || game.is_ended) return
		game.cancel_promotion()
		emit_game_state(game)
	})

	socket.on("finish_promotion", (game_id, type) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started || game.is_ended) return
		game.finish_promotion(type)
		emit_game_state(game)
	})

	socket.on("disconnect", () => {
		const game = Game.find_by_player(socket.id)
		if (!game) return
		io.to(game.id).emit("toast", "Player has disconnected", "error")
		socket.leave(game.id)
		delete game.players[socket.id]
	})
})
