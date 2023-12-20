<script lang="ts">
	import Piece from "./Piece.svelte"
	import Square from "./Square.svelte"

	import type { Board_State, Coord } from "$shared/types"
	import { COLS, ROWS, SIZE } from "$shared/config"
	import { has_coord, gen_coord, key } from "$shared/utils"

	export let board_state: Board_State
	export let possible_targets: Coord[] = []
	export let selected_coord: Coord | null = null
	export let flipped: boolean = false
</script>

<div class="board" class:flipped style:--size={SIZE}>
	<div class="squares">
		{#each ROWS as row}
			{#each COLS as col}
				{@const coord = gen_coord(row, col)}
				<Square
					{coord}
					light={(row + col) % 2 == 0}
					highlighted={has_coord(possible_targets, coord)}
					selected={selected_coord != null && key(coord) == key(selected_coord)}
					on:select
				/>
			{/each}
		{/each}
	</div>
	{#each board_state as piece}
		<Piece {piece} {flipped} />
	{/each}
</div>

<style>
	.board {
		--unit: calc(var(--width) / var(--size));
		box-sizing: content-box;
		width: var(--width);
		height: var(--width);
		margin-inline: auto;
		border: 0.4rem solid var(--border-color);
		position: relative;
	}

	.board.flipped {
		transform: rotate(180deg);
	}

	.squares {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(var(--size), 1fr);
		grid-template-rows: repeat(var(--size), 1fr);
	}
</style>
