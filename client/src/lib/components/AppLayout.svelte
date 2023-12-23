<script lang="ts">
	export let two_sided: boolean = false
</script>

<div class="layout" class:two_sided>
	<header>
		<slot name="header" />
	</header>
	<main>
		<slot name="main" />
	</main>
	<aside>
		<slot name="aside" />
	</aside>
</div>

<style>
	.layout {
		--width: min(95vmin, 45rem);
		margin-inline: auto;
		width: var(--width);
	}

	@media (min-width: 70rem) {
		.layout.two_sided {
			display: grid;
			width: fit-content;
			grid-template-columns: 1fr 20rem;
			column-gap: 1rem;
		}

		.layout.two_sided main,
		.layout.two_sided aside {
			grid-row: 2;
		}
	}
</style>
