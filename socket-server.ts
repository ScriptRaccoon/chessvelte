import type { ViteDevServer } from "vite"
import { Server } from "socket.io"

export default {
	name: "socket server",
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return
		const io = new Server(server.httpServer)
		io.on("connection", (socket) => {
			console.log("socket connected:", socket.id)

			socket.emit("message", "Hello from the server!")

			socket.on("disconnect", () => {
				console.log("socket disconnected:", socket.id)
			})

			socket.on("counter", (counter) => {
				io.emit("counter", counter)
			})
		})
	}
}
