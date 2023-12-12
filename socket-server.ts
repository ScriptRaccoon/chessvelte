import type { ViteDevServer } from "vite"
import { Server } from "socket.io"
import type {
	client_to_server_event,
	server_to_client_event
} from "./src/lib/types"

export default {
	name: "socket server",
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return
		const io = new Server<client_to_server_event, server_to_client_event>(
			server.httpServer
		)
		io.on("connection", (socket) => {
			console.log("socket connected:", socket.id)

			socket.emit("message", "Hello from the server!")

			socket.on("disconnect", () => {
				console.log("socket disconnected:", socket.id)
			})
		})
	}
}
