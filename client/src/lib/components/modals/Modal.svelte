<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let open: boolean = false
	export let with_confirm_button: boolean = false
	export let with_cancel_button: boolean = false
	export let confirm_text: string = "Ok"
	export let cancel_text: string = "Cancel"
	export let w: string = "20rem"
	export let overlay: boolean = true

	const dispatch = createEventDispatcher()
</script>

{#if open && overlay}
	<div class="overlay"></div>
{/if}

<dialog {open} style:--w={w}>
	<slot />
	{#if with_confirm_button || with_cancel_button}
		<menu>
			{#if with_confirm_button}
				<button class="button" on:click={() => dispatch("confirm")}>
					{confirm_text}
				</button>
			{/if}
			{#if with_cancel_button}
				<button class="button" on:click={() => dispatch("cancel")}>
					{cancel_text}
				</button>
			{/if}
		</menu>
	{/if}
</dialog>

<style>
	.overlay {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #0006;
	}

	dialog {
		z-index: 20;
		width: min(var(--w), 95vw);
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
		font-size: 1.25rem;
	}

	menu {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 1rem;
	}
</style>
