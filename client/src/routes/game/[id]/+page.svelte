<script lang="ts">
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
	import { PUBLIC_SERVER_URL } from "$env/static/public"
	import Outcome from "$lib/components/Outcome.svelte"
	import Invitation from "$lib/components/Invitation.svelte"

	export let data

	const game_id: string = data.game_id
	const client_id: string = data.client_id

	let my_color: Color | null = null
	let game_state: Game_State | null = null
	let show_outcome_dialog: boolean = true

	$: my_turn = game_state !== null && game_state.current_color === my_color

	const socket: Socket<server_to_client_event, client_to_server_event> =
		io(PUBLIC_SERVER_URL)

	socket.emit("me", game_id, client_id)

	socket.on("your_color", (color) => {
		my_color = color
	})

	socket.on("game_state", (server_game_state) => {
		game_state = server_game_state
		show_outcome_dialog = game_state.is_ended
	})

	socket.on("toast", (message, variant) => {
		send_toast({
			description: message,
			variant,
		})
	})

	function select(event: CustomEvent<Coord>) {
		if (!my_turn || !game_state?.is_started || game_state?.is_ended) return
		const coord = event.detail
		socket.emit("select", game_id, coord)
	}

	function resign() {
		if (!game_state?.is_started || game_state?.is_ended) return
		socket.emit("resign", game_id)
	}

	function restart() {
		if (!game_state?.is_started || !game_state?.is_ended) return
		socket.emit("restart", game_id)
	}

	function finish_promotion(e: CustomEvent<PIECE_TYPE>) {
		if (!game_state?.is_started || game_state?.is_ended) return
		const type = e.detail
		socket.emit("finish_promotion", game_id, type)
	}

	function cancel_promotion() {
		if (!game_state?.is_started || game_state?.is_ended) return
		socket.emit("cancel_promotion", game_id)
	}
</script>

<Toast />

<Invitation is_started={game_state?.is_started === true} />

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

<Outcome bind:show_outcome_dialog outcome={game_state?.outcome ?? ""} />
