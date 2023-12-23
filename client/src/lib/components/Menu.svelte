<script lang="ts">
	import type { Color } from "$shared/types"
	import Fa from "svelte-fa"
	import { faComments } from "@fortawesome/free-solid-svg-icons"
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let my_turn: boolean
	export let current_color: Color
	export let is_ended: boolean
	export let pending_messages: boolean

	$: turn_message = my_turn ? "It's your turn" : "Wait"
</script>

<div class="wrapper">
	<span class="circle {current_color}">
		<div class="vh">
			current turn is {current_color}
		</div>
	</span>

	<div class="message" aria-live="polite">
		{#if !is_ended}
			<span class="turn_message">{turn_message}</span>
		{/if}
	</div>

	<menu>
		<button
			class="button"
			class:pulse={pending_messages}
			aria-label="toggle chat"
			on:click={() => dispatch("toggle_chat")}
		>
			<Fa icon={faComments} />
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
		gap: 0.5rem;
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

	.pulse :global(svg) {
		animation: pulse 1s infinite ease-in alternate;
	}

	@keyframes pulse {
		0% {
			scale: 0.8;
		}
		100% {
			scale: 1;
		}
	}
</style>
