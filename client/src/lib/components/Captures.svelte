<script lang="ts">
	import type { Piece_State } from "$shared/types"
	import { piece_src } from "$shared/utils"
	import GameCard from "./GameCard.svelte"

	export let captured_pieces: Piece_State[] = []

	$: white_group = captured_pieces
		.filter((piece) => piece.color === "white")
		.sort((p, q) => p.value - q.value)

	$: black_group = captured_pieces
		.filter((piece) => piece.color === "black")
		.sort((p, q) => p.value - q.value)

	$: groups = [white_group, black_group]
</script>

<GameCard title="Captures">
	<div class="captures">
		{#each groups as pieces}
			<div class="group">
				{#each pieces as piece}
					<svg class="capture">
						<use xlink:href={piece_src(piece.type, piece.color)} />
					</svg>
				{/each}
			</div>
		{/each}
	</div>
</GameCard>

<style>
	.captures {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		min-height: 2rem;
	}

	.capture {
		width: 1.4rem;
		height: 1.4rem;
	}

	.group {
		display: flex;
		flex-wrap: wrap;
		align-items: start;
		background-color: var(--card-color);
	}

	.group:nth-child(1) {
	}

	.group:nth-child(2) {
		justify-content: end;
	}
</style>
