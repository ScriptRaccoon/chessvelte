<script lang="ts">
	export let title: string = ""
</script>

<section>
	<header>
		<h2>{title}</h2>
	</header>
	<div class="content">
		<slot />
	</div>
</section>

<style>
	section {
		background-color: var(--game-card-color);
		padding: 1rem;
		border-radius: 0.25rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-weight: 400;
		font-size: 1.25rem;
	}
	header {
		margin-bottom: 1rem;
	}
</style>
