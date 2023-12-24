<script>
	import { page } from "$app/stores"
	import Title from "$lib/components/Title.svelte"
</script>

<Title />

<main>
	<h2>Error: {$page.error?.message}</h2>

	<p>
		<a href="/">Home</a>
	</p>
</main>

<style>
	main {
		text-align: center;
	}
	h2 {
		color: var(--error-color);
		font-weight: 300;
		font-size: 1.25rem;
		padding-block: 2rem 1rem;
	}
</style>
