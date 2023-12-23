<script lang="ts">
	import Piece from "./Piece.svelte"
	import Square from "./Square.svelte"

	import type { Board_State, Coord, Move_State } from "$shared/types"
	import { COLS, ROWS, SIZE } from "$shared/config"
	import { has_coord, gen_coord, key, rotate } from "$shared/utils"

	export let board_state: Board_State
	export let possible_targets: Coord[] = []
	export let selected_coord: Coord | null = null
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
					highlighted={has_coord(possible_targets, coord)}
					last_move={last_move !== null &&
						has_coord(Object.values(last_move), coord)}
					selected={selected_coord != null && key(coord) == key(selected_coord)}
					on:select
				/>
			{/each}
		{/each}
	</div>
	{#each board_state as piece}
		{@const coord = rotate(piece.coord, flipped)}
		<Piece piece={{ ...piece, coord }} />
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
