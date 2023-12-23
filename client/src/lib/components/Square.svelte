<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import type { Coord } from "$shared/types"

	export let coord: Coord
	export let light: boolean
	export let highlighted: boolean
	export let selected: boolean = false
	export let last_move: boolean = false

	const dispatch = createEventDispatcher<{ select: Coord }>()
</script>

<button
	class="square"
	class:light
	class:dark={!light}
	on:click={() => dispatch("select", coord)}
	class:last_move
	class:selected
	class:highlighted
>
</button>

<style>
	.square {
		position: relative;
		outline-offset: -0.1rem;
	}

	.square.light {
		background-color: var(--light-square-color);
	}

	.square.dark {
		background-color: var(--dark-square-color);
	}

	.square:before {
		content: "";
		position: absolute;
		inset: 0;
		background-color: var(--overlay, transparent);
	}

	.square.selected {
		--overlay: var(--selected-color);
	}

	.square.highlighted {
		--overlay: var(--highlight-color);
	}

	.square.last_move:not(.selected, .highlighted) {
		--overlay: var(--lastmove-color);
	}
</style>
