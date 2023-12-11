import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import socketServer from "./socket-server.js"

export default defineConfig({
	plugins: [sveltekit(), socketServer]
})
