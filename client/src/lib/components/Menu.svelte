<script lang="ts">
	import { fly } from "svelte/transition"
	import { createEventDispatcher } from "svelte"
	import Fa from "svelte-fa"
	import { faComments } from "@fortawesome/free-solid-svg-icons"
	import type { Color } from "$shared/types"
	import { display_large_number } from "$shared/utils"

	const dispatch = createEventDispatcher()

	export let my_turn: boolean
	export let current_color: Color
	export let is_ended: boolean
	export let pending_messages: number = 0

	$: turn_message = my_turn ? "Your turn" : "Wait"
</script>

<div class="wrapper">
	<span class="circle {current_color}">
		<div class="vh">
			current turn is {current_color}
		</div>
	</span>

	<div aria-live="polite">
		{#if !is_ended}
			<span class="turn_message">{turn_message}</span>
		{/if}
	</div>

	<menu>
		<button
			class="button"
			aria-label="toggle chat"
			on:click={() => dispatch("toggle_chat")}
		>
			<Fa icon={faComments} />
			{#if pending_messages > 0}
				<span transition:fly={{ duration: 200, x: 10 }} class="counter"
					>{display_large_number(pending_messages)}</span
				>
			{/if}
		</button>
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
</div>

<style>
	.wrapper {
		margin-block: 1rem 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.circle {
		width: 1.5rem;
		height: 1.5rem;
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
	}

	menu {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
	}

	.counter {
		position: absolute;
		top: -0.25rem;
		left: -1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 1.4rem;
		height: 1.4rem;
		font-size: 0.9rem;
		border-radius: 100vw;
		background-color: var(--error-color);
	}

	@media (max-width: 22rem) {
		.turn_message {
			font-size: 0.75rem;
		}
	}
</style>
