<script lang="ts">
	import type { Piece_Info } from "$shared/types"
	import { filter_pieces, piece_src } from "$shared/utils"
	import GameCard from "./GameCard.svelte"

	export let captured_pieces: Piece_Info[] = []

	$: white_pieces = filter_pieces(captured_pieces, "white")
	$: black_pieces = filter_pieces(captured_pieces, "black")
</script>

<GameCard title="Captures">
	{#if captured_pieces.length > 0}
		<div class="captures">
			{#each [white_pieces, black_pieces] as pieces}
				<div class="group" class:empty={pieces.length === 0}>
					{#each pieces as piece}
						<svg class="capture">
							<use xlink:href={piece_src(piece.type, piece.color)} />
						</svg>
					{/each}
				</div>
			{/each}
		</div>
	{:else}
		<p class="no_captures">No captures yet.</p>
	{/if}
</GameCard>

<style>
	.captures {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		align-items: start;
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
		padding: 0.2rem;
		border-radius: 0.2rem;
		gap: 0.2rem;
	}

	.group.empty {
		visibility: hidden;
	}

	.group:nth-child(2) {
		justify-content: end;
	}

	.no_captures {
		color: var(--secondary-font-color);
	}
</style>
