<script lang="ts">
	import type { Color, Coord, Game_State } from "$lib/types"

	import Menu from "./Menu.svelte"
	// import Promotion from "./Promotion.svelte"
	import Board from "./Board.svelte"
	import Captures from "./Captures.svelte"
	import { createEventDispatcher } from "svelte"

	const dispatch = createEventDispatcher()

	export let game_state: Game_State
	export let my_turn: boolean = false
	export let my_color: Color

	let flipped: boolean = my_color === "black"

	function select_coord(event: CustomEvent<Coord>): void {
		const coord = event.detail
		dispatch("select", coord)
	}

	// function finish_promotion(e: CustomEvent<PIECE_TYPE>) {
	// 	const type = e.detail
	// 	game.finish_promotion(type, finish_move)
	// }

	function restart(): void {
		dispatch("restart")
	}

	// function cancel_promotion() {
	// 	game.cancel_promotion()
	// }

	function flip_board() {
		flipped = !flipped
	}
</script>

<Board
	board_map={game_state.board_map}
	on:select={select_coord}
	possible_targets={game_state.possible_targets}
	selected_coord={game_state.selected_coord}
	flipped={game_state.is_started && flipped}
/>

{#if game_state.is_started}
	<Menu
		current_color={game_state.current_color}
		{my_turn}
		on:flip={flip_board}
		on:restart={restart}
	/>
{/if}

<Captures captured_pieces={game_state.captured_pieces} />

<!-- {#if game_state.promotion_move != null}
	<Promotion
		color={game_state.current_color}
		on:type={finish_promotion}
		on:cancel={cancel_promotion}
	/>
{/if} -->
