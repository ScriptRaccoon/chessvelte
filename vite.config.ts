import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import socketServer from "./backend/socket-server"

export default defineConfig({
	plugins: [sveltekit(), socketServer]
})
