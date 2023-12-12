<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event
	} from "$lib/types"

	export let data

	const game_id = data.game_id

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.on("connect", () => {
		console.log("socket connected:", socket.id)
	})

	socket.on("message", (message) => {
		console.log(message)
	})

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
	}
</script>

<span>
	<a href="/">Home</a>
</span>

<h1>Game {game_id}</h1>

<p>
	<button on:click={copy_url}>Copy URL</button>
</p>
