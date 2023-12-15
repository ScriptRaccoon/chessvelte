<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event,
		Game_State,
		Coord,
		Color
	} from "$lib/types"
	import Game from "$lib/components/Game.svelte"
	import Toast, { send_toast } from "$lib/components/Toast.svelte"
	import Dialog from "$lib/components/Dialog.svelte"

	export let data

	const game_id = data.game_id
	const client_id = data.client_id

	let my_color: Color | null = null
	let game_state: Game_State | null = null

	$: my_turn = game_state !== null && game_state.current_color === my_color

	const socket: Socket<server_to_client_event, client_to_server_event> = io()

	socket.emit("me", game_id, client_id)

	socket.on("your_color", (color) => {
		my_color = color
	})

	socket.on("game_state", (_game_state) => {
		game_state = _game_state
	})

	socket.on("toast", (message, variant) => {
		send_toast({
			description: message,
			variant
		})
	})

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
		send_toast({
			description: "Copied URL to clipboard!",
			variant: "success"
		})
	}

	function select(event: CustomEvent<Coord>) {
		if (!my_turn) return
		const coord = event.detail
		socket.emit("select", game_id, coord)
	}

	function restart() {
		socket.emit("restart", game_id)
	}
</script>

<Toast />

<Dialog open={!game_state?.is_started}>
	<p class="invite_message">Invite others to join the game!</p>
	<p>
		<button class="button" on:click={copy_url}>Copy URL</button>
	</p>
</Dialog>

{#if game_state && my_color}
	<Game
		{game_state}
		{my_turn}
		{my_color}
		on:select={select}
		on:restart={restart}
	/>
{/if}

<style>
	.invite_message {
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}
</style>
