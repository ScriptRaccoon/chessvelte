<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import type { Coord } from "$shared/types"

	export let coord: Coord
	export let light: boolean
	export let highlighted: boolean
	export let selected: boolean = false

	const dispatch = createEventDispatcher<{ select: Coord }>()
</script>

<button
	class="square"
	class:light
	class:dark={!light}
	on:click={() => dispatch("select", coord)}
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

	.square.selected::before {
		content: "";
		position: absolute;
		inset: 0;
		background-color: var(--selected-color);
	}

	.square.highlighted::before {
		content: "";
		position: absolute;
		inset: 0;
		background-color: var(--highlight-color);
	}
</style>
