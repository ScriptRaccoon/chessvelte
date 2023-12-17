<script lang="ts">
	import { page } from "$app/stores"
	import { io, type Socket } from "socket.io-client"
	import type {
		server_to_client_event,
		client_to_server_event,
		Game_State,
		Coord,
		Color,
		PIECE_TYPE,
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

	let show_outcome_dialog = true

	socket.emit("me", game_id, client_id)

	socket.on("your_color", (color) => {
		my_color = color
	})

	socket.on("game_state", (_game_state) => {
		game_state = _game_state
		show_outcome_dialog = game_state.is_ended
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
	}

	function restart() {
		socket.emit("restart", game_id)
	}

	function finish_promotion(e: CustomEvent<PIECE_TYPE>) {
		const type = e.detail
		socket.emit("finish_promotion", game_id, type)
	}

	function cancel_promotion() {
		socket.emit("cancel_promotion", game_id)
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
		on:finish_promotion={finish_promotion}
		on:cancel_promotion={cancel_promotion}
	/>
{/if}

<Dialog
	open={show_outcome_dialog}
	with_close_button={true}
	on:close={() => (show_outcome_dialog = false)}
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
