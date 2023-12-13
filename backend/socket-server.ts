import type { ViteDevServer } from "vite"
import { Server } from "socket.io"
import type {
	client_to_server_event,
	server_to_client_event
} from "../src/lib/types"
import { Game } from "./Game"

export default {
	name: "socket server",
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return
		const io = new Server<client_to_server_event, server_to_client_event>(
			server.httpServer
		)
		io.on("connection", (socket) => {


			socket.on("me", (game_id, client_id) => {
				socket.join(game_id)
				const game = Game.get_by_id(game_id) ?? new Game(game_id)
				const player = game.add_player(client_id)
				if (player) socket.emit("turn", player.turn)				
				socket.emit("game_state", game.counter, game.turn)
			})

			socket.on("increment", (game_id) => {
				const game = Game.get_by_id(game_id)
				if (!game) return
				game.increment_counter()
				io.to(game_id).emit("game_state", game.counter, game.turn)
			})

			socket.on("decrement", (game_id) => {
				const game = Game.get_by_id(game_id)
				if (!game) return
				game.decrement_counter()
				io.to(game_id).emit("game_state", game.counter, game.turn)
			})

			
		})
	}
}
