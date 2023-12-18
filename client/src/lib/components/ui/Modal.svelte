<script lang="ts" context="module">
	import { writable } from "svelte/store"

	const modal_state = writable<Modal_Options | null>(null)

	type Modal_Options = {
		confirm: { action: () => void; text: string } | null
		cancel: { action: () => void; text: string } | null
		with_overlay: boolean
		text: string
	}

	const DEFAULT_OPTIONS: Modal_Options = {
		confirm: { action: () => {}, text: "Ok" },
		cancel: { action: () => {}, text: "Cancel" },
		with_overlay: true,
		text: "",
	}

	export function open_modal(options: Partial<Modal_Options>) {
		modal_state.set({ ...DEFAULT_OPTIONS, ...options })
	}

	export function close_modal() {
		modal_state.set(null)
	}
</script>

<script lang="ts">
	function confirm() {
		if ($modal_state?.confirm) {
			$modal_state.confirm.action()
			$modal_state = null
		}
	}

	function cancel() {
		if ($modal_state?.cancel) {
			$modal_state.cancel.action()
			$modal_state = null
		}
	}
</script>

{#if $modal_state?.with_overlay}
	<div class="overlay"></div>
{/if}

<dialog open={$modal_state !== null}>
	{#if $modal_state?.text}
		<p>
			{$modal_state?.text}
		</p>
	{:else}
		<slot />
	{/if}
	{#if $modal_state?.confirm || $modal_state?.cancel}
		<menu>
			{#if $modal_state?.confirm}
				<button class="button" on:click={confirm}>
					{$modal_state?.confirm.text}
				</button>
			{/if}
			{#if $modal_state?.cancel}
				<button class="button" on:click={cancel}>
					{$modal_state?.cancel.text}
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
		width: fit-content;
		max-width: 95vw;
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
