<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import Dialog from "./Dialog.svelte"

	import type { Color } from "$shared/types"
	import { piece_src } from "$shared/utils"
	import { PROMOTION_PIECE_TYPES } from "$shared/config"

	export let color: Color

	const dispatch = createEventDispatcher()
</script>

<Dialog
	open={true}
	with_cancel_button={true}
	w="25rem"
	on:cancel={() => dispatch("cancel_promotion")}
>
	<div class="choices">
		{#each PROMOTION_PIECE_TYPES as type}
			<button on:click={() => dispatch("finish_promotion", type)}>
				<svg>
					<use xlink:href={piece_src(type, color)} />
				</svg>
			</button>
		{/each}
	</div>
</Dialog>

<style>
	.choices {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}

	button {
		aspect-ratio: 1;
	}

	svg {
		width: 100%;
		height: 100%;
	}
</style>
