<script lang="ts">
	import type { Coord } from "$lib/types"

	// import { Game as GameController } from "@/controllers/Game"
	import type { Piece } from "../../../backend/controllers/Piece"

	import Menu from "./Menu.svelte"
	import Alert from "./Alert.svelte"
	import Promotion from "./Promotion.svelte"
	import Board from "./Board.svelte"
	import Captures from "./Captures.svelte"

	// TODO: needs to be created on the server
	// const game = new GameController()

	let alert_message: string | null = null
	let move_counter: number = 0
	let flipped: boolean = false

	function handle_board_click(event: CustomEvent<Coord>): void {
		const coord = event.detail
		// game.select_coord(coord, finish_move)
		// game.rerender = true // tells Svelte to rerender
	}

	function finish_move(): void {
		send_alert()
		move_counter += 1
	}

	function send_alert(): void {
		// if (game.status === "checkmate") {
		// 	alert_message = `Checkmate against ${game.current_color}!`
		// } else if (game.status === "stalemate") {
		// 	alert_message = "Stalemate! It's a draw."
		// }
	}

	function finish_promotion(e: CustomEvent<Piece["type"]>) {
		// const type = e.detail
		// game.finish_promotion(type, finish_move)
		// game.rerender = true
	}

	function restart(): void {
		// game.reset()
		// game.rerender = true
		// alert_message = null
		// move_counter = 0
	}

	function cancel_promotion() {
		// game.cancel_promotion()
		// game.rerender = true
	}

	function flip_board() {
		flipped = !flipped
	}
</script>

<!-- <Board
	{move_counter}
	board={game.board}
	on:click={handle_board_click}
	possible_targets={game.possible_moves.map((move) => move.end)}
	move_start_coord={game.move_start_coord}
	{flipped}
/>

<Menu on:restart={restart} color={game.current_color} on:flip={flip_board} />

<Captures captured_pieces={game.captures.map((capture) => capture.piece)} />

{#if game.promotion_move != null}
	<Promotion
		color={game.current_color}
		on:type={finish_promotion}
		on:cancel={cancel_promotion}
	/>
{/if}

<Alert bind:alert_message /> -->
