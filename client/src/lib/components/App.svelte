<script lang="ts">
	import { page } from "$app/stores"
	import { onDestroy } from "svelte"
	import { fade } from "svelte/transition"
	import { PUBLIC_SERVER_URL } from "$env/static/public"

	import { io, type Socket } from "socket.io-client"

	import type {
		Server_Event,
		Client_Event,
		Game_State,
		Coord,
		Color,
		Piece_Type,
		Chat_Message,
		Move_Info,
	} from "$shared/types"
	import { key } from "$shared/utils"

	import Toast, { send_toast } from "./ui/Toast.svelte"
	import Dialog, { close_dialog, open_dialog } from "./ui/Dialog.svelte"
	import Promotion from "./Promotion.svelte"
	import GameHeader from "./GameHeader.svelte"
	import Loader from "./ui/Loader.svelte"
	import AppLayout from "./AppLayout.svelte"
	import Chat from "./Chat.svelte"
	import Captures from "./Captures.svelte"
	import Menu from "./Menu.svelte"
	import Board from "./Board.svelte"
	import Settings from "./Settings.svelte"
	import Help from "./Help.svelte"

	// PROPS

	export let game_id: string
	export let client_id: string
	export let name: string

	// GLOBAL VARIABLES

	let my_color: Color | null = null
	let game_state: Game_State | null = null
	let selected_coord: Coord | null = null
	let during_promotion: boolean = false
	let promotion_target: Coord | null = null

	let chat_messages: Chat_Message[] = []
	let show_chat: boolean = false
	let pending_messages: number = 0

	let board_flipped: boolean = false
	let show_settings: boolean = false
	let show_help: boolean = false

	// COMPUTED VARIABLES

	$: my_turn = game_state?.current_color === my_color

	$: possible_moves = game_state?.possible_moves ?? {}

	$: possible_targets = selected_coord
		? possible_moves[key(selected_coord)].map((move) => move.end)
		: []

	$: animate_pieces = game_state?.is_started && game_state.last_move != null

	// SOCKET CONNECTION

	const socket: Socket<Server_Event, Client_Event> = io(PUBLIC_SERVER_URL)

	socket.emit("join", game_id, client_id, name)

	onDestroy(() => {
		socket.disconnect()
	})

	// LISTENERS

	socket.on("game_state", (server_game_state) => {
		game_state = server_game_state

		if (!game_state.is_started) {
			open_invitation_dialog()
		}
	})

	socket.on("color", (color) => {
		my_color = color
		board_flipped = my_color === "black"
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
		if (!show_chat && msg.name) {
			pending_messages++
		}
	})

	socket.on("outcome", (msg) => {
		open_outcome_modal(msg)
	})

	// ACTIONS

	function select(coord: Coord): void {
		if (!game_state || game_state?.is_ended || !my_turn) return

		const piece = game_state.pieces.find(
			(piece) => key(piece.coord) === key(coord),
		)

		if (selected_coord) {
			if (key(selected_coord) === key(coord)) {
				selected_coord = null
			} else if (piece?.color === my_color) {
				selected_coord = coord
			} else {
				generate_move(selected_coord, coord)
			}
		} else if (piece?.color === my_color) {
			selected_coord = coord
		}
	}

	function generate_move(start: Coord, end: Coord): void {
		const move = possible_moves[key(start)]?.find(
			(move) => key(move.end) === key(end),
		)
		if (!move) return
		if (move.type === "promotion") {
			promotion_target = end
			open_promotion_modal()
		} else {
			socket.emit("move", move)
			selected_coord = null
		}
	}

	function resign() {
		socket.emit("resign")
	}

	function restart() {
		socket.emit("restart")
	}

	function finish_promotion(type: Piece_Type) {
		if (!selected_coord || !promotion_target) return
		const move: Move_Info = {
			start: selected_coord,
			end: promotion_target,
			type: "promotion",
			promotion_choice: type,
		}
		socket.emit("move", move)
		cancel_promotion()
		close_dialog()
	}

	function cancel_promotion() {
		selected_coord = null
		promotion_target = null
		setTimeout(() => {
			during_promotion = false
		}, 200)
	}

	function offer_draw() {
		socket.emit("offer_draw")
	}

	function accept_draw() {
		socket.emit("accept_draw")
	}

	function reject_draw() {
		socket.emit("reject_draw")
	}

	function chat(e: CustomEvent<string>) {
		socket.emit("chat", {
			name,
			content: e.detail,
		})
	}

	// DIALOGS AND MODALS

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

	function open_outcome_modal(msg: string) {
		open_dialog({
			text: msg,
			confirm: { text: "Ok", action: () => {} },
			cancel: null,
			modal: true,
		})
	}

	function open_promotion_modal() {
		during_promotion = true
		open_dialog({
			confirm: null,
			cancel: { text: "Cancel", action: cancel_promotion },
			modal: true,
		})
	}

	// UI TOGGLES

	function toggle_chat() {
		show_chat = !show_chat
		if (show_chat) pending_messages = 0
	}

	function flip_board() {
		board_flipped = !board_flipped
	}

	function toggle_settings() {
		show_settings = !show_settings
		if (show_settings) show_help = false
	}

	function toggle_help() {
		show_help = !show_help
		if (show_help) show_settings = false
	}
</script>

<AppLayout two_sided={game_state?.is_started && !show_settings && !show_help}>
	<svelte:fragment slot="header">
		<GameHeader
			player_names={game_state?.player_names ?? null}
			{toggle_settings}
			{toggle_help}
		/>
	</svelte:fragment>

	<svelte:fragment slot="main">
		{#if game_state && my_color}
			{#if show_settings}
				<Settings bind:show_settings />
			{:else if show_help}
				<Help bind:show_help />
			{:else}
				<div in:fade={{ duration: 200 }}>
					<Board
						pieces={game_state.pieces}
						{selected_coord}
						{possible_targets}
						flipped={game_state.is_started && board_flipped}
						last_move={game_state.last_move}
						{animate_pieces}
						on:select={(e) => select(e.detail)}
					/>
					{#if game_state.is_started}
						<Menu
							is_ended={game_state.is_ended}
							current_color={game_state.current_color}
							{pending_messages}
							{my_turn}
							on:flip={flip_board}
							on:resign={open_resign_modal}
							on:restart={restart}
							on:draw={offer_draw}
							on:toggle_chat={toggle_chat}
						/>
					{/if}
				</div>
			{/if}
		{:else}
			<Loader message="Game is being loaded" />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="aside">
		{#if game_state?.is_started && !show_settings && !show_help}
			<Chat messages={chat_messages} {show_chat} on:chat={chat} />
			<Captures captured_pieces={game_state?.captured_pieces ?? []} />
		{/if}
	</svelte:fragment>
</AppLayout>

<Toast />

<Dialog>
	{#if during_promotion && my_color}
		<Promotion color={my_color} {finish_promotion} />
	{/if}
</Dialog>
