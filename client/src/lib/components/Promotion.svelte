<script lang="ts">
	import { PROMOTION_PIECE_TYPES } from "$shared/config"
	import type { Color, Piece_Type } from "$shared/types"
	import { piece_src } from "$shared/utils"

	export let color: Color
	export let finish_promotion: (type: Piece_Type) => void
</script>

<div class="choices">
	{#each PROMOTION_PIECE_TYPES as type}
		<button on:click={() => finish_promotion(type)}>
			<svg role="img">
				<use xlink:href={piece_src(type, color)} />
			</svg>
		</button>
	{/each}
</div>

<style>
	.choices {
		width: 100%;
		overflow: hidden;
		display: flex;
	}

	button {
		flex-grow: 1;
		aspect-ratio: 1 / 1;
	}

	svg {
		width: 100%;
		height: 100%;
	}
</style>
