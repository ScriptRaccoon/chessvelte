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
	let ready: boolean = false
	let my_turn: number | null = null

	$: its_my_turn = current_turn !== null && current_turn === my_turn

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.on("turn", (_turn) => {
		my_turn = _turn
	})

	socket.on("game_state", (_counter, _current_turn, _started) => {
		started = _started
		counter = _counter
		current_turn = _current_turn
	})

	socket.on("ready", () => {
		ready = true
	})

	socket.on("start", () => {
		started = true
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

	function start_game() {
		socket.emit("start", game_id)
	}
</script>

<span>
	<a href="/">Home</a>
</span>

<h1>Game {game_id}</h1>

<p>
	<button on:click={copy_url}>Copy URL</button>
</p>

{#if ready && !started}
	<p>Two players are present. Do you want to start the game?</p>
	<p>
		<button on:click={start_game}>Start</button>
	</p>
{/if}

{#if started}
	<p>
		{#if its_my_turn}
			It is your turn!
		{:else}
			It is your opponent's turn!
		{/if}
	</p>

	<div>
		<button on:click={increment} disabled={!its_my_turn}> Increment </button>
		<button on:click={decrement} disabled={!its_my_turn}> Decrement </button>
	</div>

	{#if counter !== null}
		<div>{counter}</div>
	{/if}
{/if}

<style>
	button[disabled] {
		opacity: 0.8;
		cursor: not-allowed;
	}
</style>
