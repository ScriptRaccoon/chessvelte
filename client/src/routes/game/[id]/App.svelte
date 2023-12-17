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
	import { browser } from "$app/environment"
	import Modal, {
		close_modal,
		open_modal,
	} from "$lib/components/ui/Modal.svelte"
	import { page } from "$app/stores"
	import Promotion from "$lib/components/Promotion.svelte"

	export let game_id: string
	export let client_id: string
	export let name: string

	let my_color: Color | null = null
	let game_state: Game_State | null = null

	$: my_turn = game_state !== null && game_state.current_color === my_color

	const socket: Socket<server_to_client_event, client_to_server_event> =
		io(PUBLIC_SERVER_URL)

	if (browser) {
		socket.emit("me", game_id, client_id, name)

		socket.on("game_state", (server_game_state) => {
			game_state = server_game_state
			my_color = game_state.colors[socket.id]
			if (game_state.is_ended) {
				open_outcome_modal()
			} else if (!game_state.is_started) {
				open_invitation_modal()
			} else if (game_state.status === "promotion") {
				open_promotion_modal()
			}
		})

		socket.on("toast", (message, variant) => {
			send_toast({
				description: message,
				variant,
			})
		})

		socket.on("offer_draw", () => {
			open_draw_modal()
		})
	}

	function select(event: CustomEvent<Coord>) {
		if (!my_turn || !game_state?.is_playing) return
		const coord = event.detail
		socket.emit("select", game_id, coord)
	}

	function resign() {
		if (!game_state?.is_playing) return
		socket.emit("resign", game_id)
	}

	function restart() {
		if (game_state?.is_playing) return
		socket.emit("restart", game_id)
	}

	function finish_promotion(e: CustomEvent<PIECE_TYPE>) {
		if (!game_state?.is_playing) return
		close_modal()
		const type = e.detail
		socket.emit("finish_promotion", game_id, type)
	}

	function cancel_promotion() {
		if (!game_state?.is_playing) return
		socket.emit("cancel_promotion", game_id)
	}

	function offer_draw() {
		if (!game_state?.is_playing) return
		socket.emit("offer_draw", game_id)
	}

	function accept_draw() {
		if (!game_state?.is_playing) return
		socket.emit("accept_draw", game_id)
	}

	function reject_draw() {
		if (!game_state?.is_playing) return
		socket.emit("reject_draw", game_id)
	}

	function open_invitation_modal() {
		open_modal({
			with_overlay: false,
			text: "Invite others to join the game!",
			confirm: { action: copy_url, text: "Copy URL" },
		})
	}

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
		send_toast({
			description: "Copied URL to clipboard!",
			variant: "success",
		})
	}

	function open_draw_modal() {
		open_modal({
			text: "A draw has been offered",
			confirm: { text: "Accept", action: accept_draw },
			cancel: { text: "Reject", action: reject_draw },
		})
	}

	function open_resign_modal() {
		open_modal({
			text: "Are you sure that you want to resign?",
			confirm: { text: "Yes", action: resign },
			cancel: { text: "No", action: () => {} },
		})
	}

	function open_outcome_modal() {
		if (game_state?.outcome) {
			open_modal({
				text: game_state.outcome,
				confirm: { text: "Ok", action: () => {} },
				cancel: null,
			})
		}
	}

	function open_promotion_modal() {
		open_modal({
			confirm: null,
			cancel: { text: "Cancel", action: cancel_promotion },
		})
	}
</script>

<Toast />

<Modal>
	{#if game_state?.status === "promotion" && my_color}
		<Promotion color={my_color} on:finish_promotion={finish_promotion} />
	{/if}
</Modal>

{#if game_state && my_color}
	<Game
		{game_state}
		{my_turn}
		{my_color}
		on:select={select}
		on:resign={open_resign_modal}
		on:restart={restart}
		on:finish_promotion={finish_promotion}
		on:cancel_promotion={cancel_promotion}
		on:draw={offer_draw}
	/>
{/if}
