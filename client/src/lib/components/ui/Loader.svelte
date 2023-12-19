<script lang="ts">
	export let message: string = ""
</script>

<div class="wrapper">
	{#if message}
		<p class="message">{message}</p>
	{/if}
	<span class="loader"></span>
</div>

<style>
	.wrapper {
		padding-block: 2rem;
		text-align: center;
	}

	.message {
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.loader {
		display: inline-block;
		width: 2rem;
		height: 2rem;
		border: 0.25rem solid var(--secondary-font-color);
		border-bottom-color: transparent;
		border-radius: 50%;
		animation: rotation 1.5s linear infinite;
	}

	@keyframes rotation {
		to {
			rotate: 1turn;
		}
	}
</style>
