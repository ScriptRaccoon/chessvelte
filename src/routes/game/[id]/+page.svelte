<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event,
		Game_State,
		Coord
	} from "$lib/types"
	import Game from "$lib/components/Game.svelte"

	export let data

	const game_id = data.game_id
	const client_id = data.client_id

	let my_turn: number | null = null
	let game_state: Game_State | null = null

	let copied: boolean = false
	let alert: string | null = null

	$: its_my_turn = game_state?.turn !== null && game_state?.turn === my_turn

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.emit("me", game_id, client_id)

	socket.on("turn", (_turn) => {
		my_turn = _turn
	})

	socket.on("game_state", (_game_state) => {
		game_state = _game_state
	})

	socket.on("alert", (message) => {
		alert = message
		setTimeout(() => {
			alert = null
		}, 1000)
	})

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

	function select(event: CustomEvent<Coord>) {
		const coord = event.detail
		socket.emit("select", game_id, coord)
	}

	function restart() {
		socket.emit("restart", game_id)
	}
</script>

<span>
	<a href="/">Home</a>
</span>

<h2>Game {game_id}</h2>

{#if alert}
	<p>{alert}</p>
{/if}

{#if game_state?.status === "waiting"}
	The game hasn't started yet. Invite others to join!
{/if}

<p>
	<button class="button" on:click={copy_url}>Copy URL</button>
	{#if copied}
		<div>Copied to clipboard!</div>
	{/if}
</p>

{#if game_state?.status === "ready"}
	<p>Two players are present. Do you want to start the game?</p>
	<p>
		<button class="button" on:click={start_game}>Start</button>
	</p>
{/if}

{#if game_state?.status === "playing"}
	<p>
		{#if its_my_turn}
			It is your turn!
		{:else}
			It is your opponent's turn!
		{/if}
	</p>
{/if}

{#if game_state && my_turn !== null}
	<Game {game_state} {my_turn} on:select={select} on:restart={restart} />
{/if}
