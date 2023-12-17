<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let open: boolean = false
	export let with_close_button: boolean = false
	export let with_cancel_button: boolean = false
	export let w: string = "20rem"

	const dispatch = createEventDispatcher()
</script>

<dialog {open} style:--w={w}>
	<div class="content">
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
	</div>
</dialog>

<style>
	dialog {
		z-index: 10;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #0006;
	}

	.content {
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
