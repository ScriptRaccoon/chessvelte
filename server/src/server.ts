import { Server } from "socket.io"
import express from "express"

import { client_to_server_event, server_to_client_event } from "$shared/types"

import { Game } from "./controllers/Game"

const app = express()
const PORT = process.env.PORT ?? 5000

const server = app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`)
})

const io = new Server<client_to_server_event, server_to_client_event>(server)

function emit_game_state(game: Game) {
	io.to(game.id).emit("game_state", game.state)
}

io.on("connection", (socket) => {
	socket.on("me", (game_id, client_id) => {
		socket.join(game_id)
		const game = Game.get_by_id(game_id) ?? new Game(game_id)

		socket.broadcast
			.to(game.id)
			.emit("toast", "Player has connected", "success")

		const player = game.add_player(socket.id, client_id)
		if (player) {
			emit_game_state(game)
			socket.emit("your_color", player.color)
		}
	})

	socket.on("select", (game_id, coord) => {
		const game = Game.get_by_id(game_id)
		if (!game || !game.is_started) return
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
		if (!game || !game.is_ended) return
		game.reset()
		emit_game_state(game)
	})

	socket.on("disconnect", () => {
		const game = Game.find_by_player(socket.id)
		if (!game) return
		io.to(game.id).emit("toast", "Player has disconnected", "error")
		socket.leave(game.id)
	})
})
