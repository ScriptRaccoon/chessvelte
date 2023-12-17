<script lang="ts">
	import { TITLE } from "$shared/config"
</script>

<header>
	<h1>{TITLE}</h1>
	<p>Play chess with anyone</p>
</header>

<style>
	header {
		padding-block: 2rem 1rem;
		text-align: center;
	}
	h1 {
		font-weight: 400;
		font-size: 2.25rem;
	}

	p {
		margin-top: 0.25rem;
		font-style: italic;
		color: var(--secondary-font-color);
	}
</style>
