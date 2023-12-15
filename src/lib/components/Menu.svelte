<script lang="ts">
	import type { Color } from "$lib/types"
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let my_turn: boolean
	export let current_color: Color

	$: turn_message = my_turn ? "It's your turn" : "Wait for other player"
</script>

<div class="wrapper">
	<span class="circle {current_color}"></span>
	<span class="turn_message">{turn_message}</span>

	<menu>
		<button class="button" on:click={() => dispatch("flip")}>Flip</button>
		<button class="button" on:click={() => dispatch("restart")}>
			Restart
		</button>
	</menu>
</div>

<style>
	.wrapper {
		width: var(--width);
		margin-inline: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 0.75rem;
	}

	.circle {
		display: inline-block;
		width: 1.5rem;
		aspect-ratio: 1;
		border-radius: 50%;
	}

	.circle.white {
		background-color: white;
		outline: 0.1rem solid black;
	}

	.circle.black {
		background-color: black;
		outline: 0.1rem solid white;
	}

	.turn_message {
		color: var(--secondary-font-color);
		margin-right: auto;
		margin-left: 0.5rem;
	}

	menu {
		display: flex;
		gap: 0.5rem;
	}
</style>
