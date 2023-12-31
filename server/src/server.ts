import express from "express"
import chalk from "chalk"
import dotenv from "dotenv"
import { Server } from "socket.io"
import type { Client_Event, Server_Event } from "$shared/types"
import { Game } from "$server/controllers/Game"
import { SocketController } from "$server/controllers/SocketController"

dotenv.config()

/**
 * Express Server
 */
const app = express()
const PORT = process.env.PORT ?? 5000

const server = app.listen(PORT, () => {
	console.info(chalk.cyan(`Server listening on port ${PORT}`))
})

/**
 * Socket IO Server
 */
const io = new Server<Client_Event, Server_Event, {}, {}>(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
	},
})

/**
 * Socket IO Event Handling
 */
io.on("connection", (socket) => {
	socket.on("join", (game_id, client_id, name) => {
		const game = Game.get_or_create_by_id(game_id)

		const { success, is_new, player } = game.add_player(
			socket.id,
			client_id,
			name,
		)

		if (!success || !player) return

		const controller = new SocketController(socket, io, game, player)
		controller.start(is_new)

		socket.on("resign", () => controller.resign())
		socket.on("offer_draw", () => controller.offer_draw())
		socket.on("reject_draw", () => controller.reject_draw())
		socket.on("accept_draw", () => controller.accept_draw())
		socket.on("move", (move) => controller.execute_move(move))
		socket.on("restart", () => controller.restart())
		socket.on("disconnect", () => controller.handle_disconnect())
		socket.on("chat", (msg) => controller.chat(msg))
	})
})
