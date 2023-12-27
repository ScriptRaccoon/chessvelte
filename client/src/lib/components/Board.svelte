<script lang="ts">
	import Piece from "./Piece.svelte"
	import Square from "./Square.svelte"

	import type { Board_State, Coord, Move_State } from "$shared/types"
	import { COLS, ROWS, SIZE } from "$shared/config"
	import {
		has_coord,
		gen_coord,
		key,
		rotate,
		typed_keys,
		unkey,
	} from "$shared/utils"
	import { highlight_setting } from "$lib/stores"

	export let board_state: Board_State
	export let selected_coord: Coord | null = null
	export let possible_targets: Coord[] = []
	export let flipped: boolean = false
	export let last_move: Move_State | null = null
</script>

<div class="board" style:--size={SIZE}>
	<div class="squares">
		{#each ROWS as row}
			{#each COLS as col}
				{@const coord = rotate(gen_coord(row, col), flipped)}
				<Square
					{coord}
					light={(row + col) % 2 == 0}
					last_move={$highlight_setting &&
						last_move !== null &&
						has_coord([last_move.start, last_move.end], coord)}
					selected={selected_coord != null && key(coord) == key(selected_coord)}
					highlighted={$highlight_setting && has_coord(possible_targets, coord)}
					on:select
				/>
			{/each}
		{/each}
	</div>
	{#each typed_keys(board_state) as coord_key}
		{@const rotated_coord = rotate(unkey(coord_key), flipped)}
		{@const piece = board_state[coord_key]}
		<Piece {piece} coord={rotated_coord} />
	{/each}
</div>

<style>
	.board {
		--dim: calc(var(--width) - 0.8rem);
		width: var(--dim);
		height: var(--dim);
		--unit: calc(var(--dim) / var(--size));
		border: 0.4rem solid var(--border-color);
		box-sizing: content-box;
		position: relative;
	}

	.squares {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(var(--size), 1fr);
		grid-template-rows: repeat(var(--size), 1fr);
	}
</style>
