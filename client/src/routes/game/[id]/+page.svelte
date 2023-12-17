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
	import Toast, { send_toast } from "$lib/components/ui/Toast.svelte"
	import { PUBLIC_SERVER_URL } from "$env/static/public"
	import Outcome from "$lib/components/modals/Outcome.svelte"
	import Invitation from "$lib/components/modals/Invitation.svelte"
	import Resign from "$lib/components/modals/Resign.svelte"
	import Draw from "$lib/components/modals/Draw.svelte"
	import { browser } from "$app/environment"

	export let data

	const game_id: string = data.game_id
	const client_id: string = data.client_id

	let my_color: Color | null = null
	let game_state: Game_State | null = null
	let show_outcome_modal: boolean = false
	let show_resign_modal: boolean = false
	let show_draw_modal: boolean = false

	$: my_turn = game_state !== null && game_state.current_color === my_color

	const socket: Socket<server_to_client_event, client_to_server_event> =
		io(PUBLIC_SERVER_URL)

	if (browser) {
		socket.emit("me", game_id, client_id)
	}

	socket.on("game_state", (server_game_state) => {
		game_state = server_game_state
		show_outcome_modal = game_state.is_ended
		my_color = game_state.colors[socket.id]
	})

	socket.on("toast", (message, variant) => {
		send_toast({
			description: message,
			variant,
		})
	})

	socket.on("offer_draw", () => {
		show_draw_modal = true
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

	function offer_draw() {
		if (!game_state?.is_started || game_state?.is_ended) return
		socket.emit("offer_draw", game_id)
	}

	function accept_draw() {
		if (!game_state?.is_started || game_state?.is_ended) return
		socket.emit("accept_draw", game_id)
	}

	function reject_draw() {
		if (!game_state?.is_started || game_state?.is_ended) return
		socket.emit("reject_draw", game_id)
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
		on:resign={() => (show_resign_modal = true)}
		on:restart={restart}
		on:finish_promotion={finish_promotion}
		on:cancel_promotion={cancel_promotion}
		on:draw={offer_draw}
	/>
{/if}

<Resign bind:show_resign_modal on:resign={resign} />

<Draw bind:show_draw_modal on:accept={accept_draw} on:reject={reject_draw} />

<Outcome bind:show_outcome_modal outcome={game_state?.outcome ?? ""} />
