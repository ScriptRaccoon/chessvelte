<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event
	} from "$lib/types"

	export let data

	const game_id = data.game_id

	let counter: number | null = null

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.on("connect", () => {
		console.log("socket connected:", socket.id)
	})

	socket.on("message", (message) => {
		console.log(message)
	})

	socket.on("counter", (counter_from_backend) => {
		console.log("got counter update from backend")
		counter = counter_from_backend
	})

	socket.emit("game_id", game_id)

	function increment() {
		socket.emit("increment", game_id)
	}

	function decrement() {
		socket.emit("decrement", game_id)
	}

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

<div>
	<button on:click={increment}>Increment</button>
	<button on:click={decrement}>Decrement</button>
</div>

{#if counter !== null}
	<div>{counter}</div>
{/if}
