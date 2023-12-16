<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { fade } from "svelte/transition"

	export let open: boolean = false
	export let with_close_button: boolean = false
	export let with_cancel_button: boolean = false
	export let w: string = "20rem"

	const dispatch = createEventDispatcher()
</script>

{#if open}
	<div class="overlay" transition:fade={{ duration: 100 }} />
{/if}

<dialog {open} style:--w={w}>
	<slot />
	{#if with_close_button || with_cancel_button}
		<menu>
			{#if with_close_button}
				<button class="button" on:click={() => dispatch("close")}>
					Ok
				</button>
			{/if}
			{#if with_cancel_button}
				<button class="button" on:click={() => dispatch("cancel")}>
					Cancel
				</button>
			{/if}
		</menu>
	{/if}
</dialog>

<style>
	dialog {
		width: min(var(--w), 95vw);
		z-index: 20;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 1rem;
		background-color: white;
		color: #222;
		text-align: center;
		border: none;
		border-radius: 0.25rem;
		box-shadow: 0rem 0rem 2rem #0005;
	}

	.overlay {
		z-index: 10;
		position: absolute;
		inset: 0;
		background-color: #0006;
	}

	menu {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
	}
</style>
