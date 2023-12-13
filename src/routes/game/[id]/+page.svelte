<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event
	} from "$lib/types"

	export let data

	const game_id = data.game_id
	const client_id = data.client_id

	let counter: number | null = null
	let current_turn: number | null = null
	let started: boolean = false
	let my_turn: number | null = null

	$: its_my_turn = current_turn !== null && current_turn === my_turn

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.on("connect", () => {
		console.log("socket connected:", socket.id)
	})

	socket.on("message", (message) => {
		console.log(message)
	})

	socket.on("turn", (_turn) => {
		my_turn = _turn
		console.log("my turn", my_turn)
	})

	socket.on("game_state", (_counter, _current_turn) => {
		counter = _counter
		current_turn = _current_turn
		console.log("current turn", current_turn)
	})

	socket.emit("me", game_id, client_id)

	function increment() {
		if (!its_my_turn) return
		socket.emit("increment", game_id)
	}

	function decrement() {
		if (!its_my_turn) return
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
	{#if its_my_turn}
		It is your turn!
	{:else}
		It is your opponent's turn!
	{/if}
</p>

<p>
	<button on:click={copy_url}>Copy URL</button>
</p>

<div>
	<button on:click={increment} disabled={!its_my_turn}> Increment </button>
	<button on:click={decrement} disabled={!its_my_turn}> Decrement </button>
</div>

{#if counter !== null}
	<div>{counter}</div>
{/if}

<style>
	button[disabled] {
		opacity: 0.8;
		cursor: not-allowed;
	}
</style>
