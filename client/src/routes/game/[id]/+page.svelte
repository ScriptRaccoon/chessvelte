<script lang="ts">
	import { page } from "$app/stores"
	import { io, Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event,
		Game_State,
		Coord,
		Color,
	} from "$shared/types"
	import Game from "$lib/components/Game.svelte"
	import Toast, { send_toast } from "$lib/components/Toast.svelte"
	import Dialog from "$lib/components/Dialog.svelte"
	import { PUBLIC_SERVER_URL } from "$env/static/public"

	export let data

	const game_id = data.game_id
	const client_id = data.client_id

	let my_color: Color | null = null
	let game_state: Game_State | null = null

	$: my_turn = game_state !== null && game_state.current_color === my_color

	const socket: Socket<server_to_client_event, client_to_server_event> =
		io(PUBLIC_SERVER_URL)

	let show_ending_dialog = true

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
			variant,
		})
	})

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
		send_toast({
			description: "Copied URL to clipboard!",
			variant: "success",
		})
	}

	function select(event: CustomEvent<Coord>) {
		if (!my_turn) return
		const coord = event.detail
		socket.emit("select", game_id, coord)
	}

	function resign() {
		socket.emit("resign", game_id)
		setTimeout(() => {
			show_ending_dialog = true
		}, 1000)
	}

	function restart() {
		socket.emit("restart", game_id)
		setTimeout(() => {
			show_ending_dialog = true
		}, 1000)
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
		on:resign={resign}
		on:restart={restart}
	/>
{/if}

<Dialog
	open={show_ending_dialog && game_state?.is_ended}
	with_close_button={true}
	on:close={() => (show_ending_dialog = false)}
>
	<p class="outcome">
		{game_state?.outcome}
	</p>
</Dialog>

<style>
	.invite_message {
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}
	.outcome {
		font-size: 1.25rem;
	}
</style>
