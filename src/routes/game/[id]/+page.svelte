<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event,
		Game_State
	} from "$lib/types"

	export let data

	const game_id = data.game_id
	const client_id = data.client_id

	let my_turn: number | null = null
	let game_state: Game_State | null = null

	let copied: boolean = false

	$: its_my_turn = game_state?.turn !== null && game_state?.turn === my_turn

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.on("turn", (_turn) => {
		my_turn = _turn
	})

	socket.on("game_state", (_game_state) => {
		game_state = _game_state
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
		copied = true
		setTimeout(() => {
			copied = false
		}, 1000)
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
	{#if copied}
		<div>Copied to clipboard!</div>
	{/if}
</p>

{#if game_state?.ready && !game_state?.started}
	<p>Two players are present. Do you want to start the game?</p>
	<p>
		<button on:click={start_game}>Start</button>
	</p>
{/if}

{#if game_state?.started}
	<p>
		{#if its_my_turn}
			It is your turn!
		{:else}
			It is your opponent's turn!
		{/if}
	</p>

	<div>
		<button on:click={increment} disabled={!its_my_turn}>Increment</button>
		<button on:click={decrement} disabled={!its_my_turn}>Decrement</button>
	</div>

	<div>{game_state.counter}</div>
{/if}

<style>
	button[disabled] {
		opacity: 0.8;
		cursor: not-allowed;
	}
</style>
