<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import type { Coord } from "$lib/types"

	export let coord: Coord
	export let light: boolean
	export let highlighted: boolean
	export let SHOW_COORDS: boolean
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
	{#if SHOW_COORDS}
		<span class="coord">
			{coord}
		</span>
	{/if}
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

	.coord {
		position: absolute;
		left: 0%;
		top: 0%;
		font-size: 0.8rem;
		font-family: monospace;
		color: white;
	}
</style>
