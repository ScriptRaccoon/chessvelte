<script lang="ts">
	import { PROMOTION_PIECE_TYPES } from "$shared/config"
	import type { Color } from "$shared/types"
	import { piece_src } from "$shared/utils"
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let color: Color
</script>

<div class="choices">
	{#each PROMOTION_PIECE_TYPES as type}
		<button on:click={() => dispatch("finish_promotion", type)}>
			<svg>
				<use xlink:href={piece_src(type, color)} />
			</svg>
		</button>
	{/each}
</div>

<style>
	.choices {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		justify-items: center;
	}

	button {
		width: 5rem;
		height: 5rem;
	}

	svg {
		width: 100%;
		height: 100%;
	}
</style>
