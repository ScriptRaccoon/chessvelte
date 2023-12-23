<script lang="ts">
	import { page } from "$app/stores"
	import { onDestroy } from "svelte"
	import { fade } from "svelte/transition"
	import { PUBLIC_SERVER_URL } from "$env/static/public"
	import { browser } from "$app/environment"

	import { io, type Socket } from "socket.io-client"
	import type {
		Server_Event,
		Client_Event,
		Game_State,
		Coord,
		Color,
		Piece_Type,
		Chat_Message,
	} from "$shared/types"

	import Game from "./Game.svelte"
	import Toast, { send_toast } from "./ui/Toast.svelte"
	import Dialog, { close_dialog, open_dialog } from "./ui/Dialog.svelte"
	import Promotion from "./Promotion.svelte"
	import GameHeader from "./GameHeader.svelte"
	import Loader from "./ui/Loader.svelte"
	import AppLayout from "./AppLayout.svelte"
	import Chat from "./Chat.svelte"
	import Captures from "./Captures.svelte"

	export let game_id: string
	export let client_id: string
	export let name: string

	let my_color: Color | null = null
	let game_state: Game_State | null = null
	let chat_messages: Chat_Message[] = []
	let show_chat: boolean = false

	$: my_turn = game_state !== null && game_state.current_color === my_color

	const socket: Socket<Server_Event, Client_Event> = io(PUBLIC_SERVER_URL)

	if (browser) {
		socket.emit("me", game_id, client_id, name)

		socket.on("game_state", (server_game_state) => {
			game_state = server_game_state
			if (game_state.is_ended) {
				open_outcome_modal()
			} else if (!game_state.is_started) {
				open_invitation_dialog()
			} else if (game_state.status === "promotion") {
				open_promotion_modal()
			}
		})

		socket.on("your_color", (color) => {
			my_color = color
		})

		socket.on("toast", (message, variant) => {
			send_toast({
				description: message,
				variant,
			})
		})

		socket.on("offer_draw", (name: string) => {
			open_draw_modal(name)
		})

		socket.on("chat", (msg) => {
			chat_messages = [...chat_messages, msg]
		})
	}

	function select(event: CustomEvent<Coord>) {
		if (!my_turn || !game_state?.is_playing) return
		const coord = event.detail
		socket.emit("select", coord)
	}

	function resign() {
		if (!game_state?.is_playing) return
		socket.emit("resign")
	}

	function restart() {
		if (game_state?.is_playing) return
		socket.emit("restart")
	}

	function finish_promotion(e: CustomEvent<Piece_Type>) {
		if (!game_state?.is_playing) return
		close_dialog()
		const type = e.detail
		socket.emit("finish_promotion", type)
	}

	function cancel_promotion() {
		if (!game_state?.is_playing) return
		socket.emit("cancel_promotion")
	}

	function offer_draw() {
		if (!game_state?.is_playing) return
		socket.emit("offer_draw")
	}

	function accept_draw() {
		if (!game_state?.is_playing) return
		socket.emit("accept_draw")
	}

	function reject_draw() {
		if (!game_state?.is_playing) return
		socket.emit("reject_draw")
	}

	function open_invitation_dialog() {
		setTimeout(() => {
			open_dialog({
				text: "Invite others to join the game!",
				confirm: { action: copy_url, text: "Copy URL" },
			})
		}, 500)
	}

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
		send_toast({
			description: "Copied URL to clipboard!",
			variant: "success",
		})
	}

	function open_draw_modal(name: string) {
		open_dialog({
			text: `${name} has offered a draw`,
			confirm: { text: "Accept", action: accept_draw },
			cancel: { text: "Reject", action: reject_draw },
			modal: true,
		})
	}

	function open_resign_modal() {
		open_dialog({
			text: "Are you sure that you want to resign?",
			confirm: { text: "Yes", action: resign },
			cancel: { text: "No", action: () => {} },
			modal: true,
		})
	}

	function open_outcome_modal() {
		if (game_state?.outcome) {
			open_dialog({
				text: game_state.outcome,
				confirm: { text: "Ok", action: () => {} },
				cancel: null,
				modal: true,
			})
		}
	}

	function open_promotion_modal() {
		open_dialog({
			confirm: null,
			cancel: { text: "Cancel", action: cancel_promotion },
			modal: true,
		})
	}

	function chat(e: CustomEvent<string>) {
		socket.emit("chat", {
			name,
			content: e.detail,
			bot: false,
		})
	}

	function toggle_chat() {
		show_chat = !show_chat
	}

	onDestroy(() => {
		socket.disconnect()
	})
</script>

<AppLayout two_sided={true}>
	<svelte:fragment slot="header">
		<GameHeader player_names={game_state?.player_names ?? null} />
	</svelte:fragment>
	<svelte:fragment slot="main">
		{#if game_state && my_color}
			<div in:fade={{ duration: 200 }}>
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
					on:toggle_chat={toggle_chat}
				/>
			</div>
		{:else}
			<Loader message="Game is being loaded" />
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="aside">
		<Chat messages={chat_messages} {show_chat} on:chat={chat} />
		<Captures captured_pieces={game_state?.captured_pieces ?? []} />
	</svelte:fragment>
</AppLayout>

<Toast />

<Dialog>
	{#if game_state?.status === "promotion" && my_color}
		<Promotion color={my_color} on:finish_promotion={finish_promotion} />
	{/if}
</Dialog>
