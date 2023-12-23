import express from "express"
import chalk from "chalk"
import dotenv from "dotenv"
import { SocketController } from "./controllers/SocketController"
import { Server } from "socket.io"
import { Client_Event, Server_Event } from "$shared/types"
import { Socket_Data } from "./types.server"

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

new SocketController(io)
