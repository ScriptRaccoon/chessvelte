<script lang="ts">
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let turn: number

	$: color = turn === 0 ? "white" : 1
</script>

<div class="wrapper">
	<div aria-label="Turn: {color}">
		<div class="circle {color}"></div>
	</div>

	<menu>
		<!-- <button class="button">Back</button> -->
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
		margin-top: 0.75rem;
	}

	.circle {
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

	menu {
		display: flex;
		gap: 0.5rem;
	}
</style>
