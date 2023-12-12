<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"

	import type {
		server_to_client_event,
		client_to_server_event
	} from "$lib/types"

	export let data

	let game = data.game

	let counter = game.counter

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.on("connect", () => {
		console.log("socket connected:", socket.id)
	})

	socket.on("message", (message) => {
		console.log(message)
	})

	socket.on("counter", (new_counter) => {
		console.log("new counter value:", new_counter)
		counter = new_counter
	})

	function increment() {
		socket.emit("counter", counter + 1)
	}

	function decrement() {
		socket.emit("counter", counter - 1)
	}

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
	}
</script>

<span>
	<a href="/">Home</a>
</span>

<h1>Game {game.id}</h1>

<p>
	<button on:click={copy_url}>Copy URL</button>
</p>

<p>
	Counter: {counter}
</p>

<menu>
	<button on:click={increment}>Increment</button>
	<button on:click={decrement}>Decrement</button>
</menu>

<style>
	menu {
		padding: 0;
	}
</style>
