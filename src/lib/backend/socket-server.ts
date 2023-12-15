import type { ViteDevServer } from "vite"
import { Server } from "socket.io"
import type { client_to_server_event, server_to_client_event } from "../types"
import { Game } from "./controllers/Game"

export default {
	name: "socket server",
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return
		const io = new Server<client_to_server_event, server_to_client_event>(
			server.httpServer
		)

		function emit_game_state(game: Game) {
			io.to(game.id).emit("game_state", game.state)
		}

		function send_alert(game: Game, msg: string) {
			io.to(game.id).emit("alert", msg)
		}

		io.on("connection", (socket) => {
			socket.on("me", (game_id, client_id) => {
				socket.join(game_id)
				const game = Game.get_by_id(game_id) ?? new Game(game_id)
				if (game.status === "playing") {
					io.to(game.id).emit("alert", "Player has reconnected")
				}
				const player = game.add_player(socket.id, client_id)
				if (player) {
					socket.emit("turn", player.turn)
					emit_game_state(game)
				}
			})

			socket.on("start", (game_id) => {
				const game = Game.get_by_id(game_id)
				if (!game || game.status === "playing") return
				game.start()
				emit_game_state(game)
			})

			socket.on("select", (game_id, coord) => {
				const game = Game.get_by_id(game_id)
				if (!game || game.status !== "playing") return
				const actionable = game.select_coord(coord)
				if (actionable) {
					emit_game_state(game)
				} else {
					socket.emit("game_state", game.state)
				}
			})

			socket.on("restart", (game_id) => {
				const game = Game.get_by_id(game_id)
				if (!game) return
				game.reset()
				emit_game_state(game)
			})

			socket.on("disconnect", () => {
				const game = Game.find_by_player(socket.id)
				if (!game) return
				send_alert(game, "Player has disconnected")
			})
		})
	}
}
