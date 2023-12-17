<script lang="ts">
	import type { Color, Coord, Game_State } from "$shared/types"

	import Menu from "./Menu.svelte"
	import Board from "./Board.svelte"
	import Captures from "./Captures.svelte"
	import { createEventDispatcher } from "svelte"

	const dispatch = createEventDispatcher()

	export let game_state: Game_State
	export let my_turn: boolean = false
	export let my_color: Color

	let flipped = false

	$: if (my_color === "black") {
		flipped = true
	} else {
		flipped = false
	}

	function select_coord(event: CustomEvent<Coord>): void {
		const coord = event.detail
		dispatch("select", coord)
	}

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
		is_ended={game_state.is_ended}
		outcome={game_state.outcome}
		current_color={game_state.current_color}
		{my_turn}
		on:flip={flip_board}
		on:resign
		on:restart
		on:draw
	/>
{/if}

<Captures captured_pieces={game_state.captured_pieces} />
