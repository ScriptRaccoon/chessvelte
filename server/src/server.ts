import express from "express"
import chalk from "chalk"
import dotenv from "dotenv"
import { Server } from "socket.io"
import type { Client_Event, Server_Event } from "$shared/types"
import { Game } from "./controllers/Game"
import { PlayerSocket } from "./controllers/PlayerSocket"

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 5000

const server = app.listen(PORT, () => {
	console.info(chalk.cyan(`Server listening on port ${PORT}`))
})

const io = new Server<Client_Event, Server_Event, {}, {}>(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
	},
})

io.on("connection", (socket) => {
	socket.on("join", (game_id, client_id, name) => {
		const game = Game.get_or_create_by_id(game_id)

		const { success, is_new } = game.add_player(socket.id, client_id, name)
		if (!success) return

		const player = new PlayerSocket(socket, io, game)
		player.start(is_new)

		socket.on("resign", () => player.resign())
		socket.on("offer_draw", () => player.offer_draw())
		socket.on("reject_draw", () => player.reject_draw())
		socket.on("accept_draw", () => player.accept_draw())
		socket.on("select", (coord) => player.select(coord))
		socket.on("restart", () => player.restart())
		socket.on("cancel_promotion", () => player.cancel_promotion())
		socket.on("finish_promotion", (type) => player.finish_promotion(type))
		socket.on("disconnect", () => player.disconnect())
		socket.on("chat", (msg) => player.chat(msg))
	})
})
