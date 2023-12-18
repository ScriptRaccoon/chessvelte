<script lang="ts">
	import type { Color } from "$shared/types"
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let my_turn: boolean
	export let current_color: Color
	export let is_ended: boolean
	export let outcome: string

	$: turn_message = my_turn ? "It's your turn" : "It is your opponent's turn"
</script>

<div class="wrapper">
	<span class="circle {current_color}"></span>

	<menu class="menu">
		<button class="button" on:click={() => dispatch("flip")}>Flip</button>
		{#if is_ended}
			<button class="button" on:click={() => dispatch("restart")}>
				Restart
			</button>
		{:else}
			<button class="button" on:click={() => dispatch("draw")}>Draw</button>
			<button class="button" on:click={() => dispatch("resign")}>Resign</button>
		{/if}
	</menu>

	<div class="message">
		{#if !is_ended}
			<span class="turn_message">{turn_message}</span>
		{:else if outcome}
			<span class="outcome">{outcome}</span>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		width: var(--width);
		margin-inline: auto;
		margin-top: 0.75rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		row-gap: 0.5rem;
		justify-content: space-between;
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

	.turn_message,
	.outcome {
		color: var(--secondary-font-color);
	}

	.message {
		grid-column: 1 / span 2;
	}

	.menu {
		display: flex;
		justify-self: flex-end;
		gap: 0.5rem;
	}

	@media (min-width: 32rem) {
		.wrapper {
			grid-template-columns: auto 1fr auto;
			column-gap: 1rem;
		}

		.message {
			grid-row: 1;
			grid-column: 2 / span 1;
		}
	}
</style>
