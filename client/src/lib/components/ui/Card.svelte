<div class="card">
	<h2 class="heading">
		<slot name="heading" />
	</h2>
	<div class="content">
		<slot name="content" />
	</div>
	<div class="cta">
		<slot name="cta" />
	</div>
</div>

<style>
	.card {
		padding: 1rem;
		border-radius: 0.25rem;
		background-color: var(--card-color);
		box-shadow: 0rem 0rem 1rem #0004;
		width: min(95vw, 20rem);
	}

	h2 {
		font-weight: initial;
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.content {
		margin-bottom: 1rem;
		color: var(--secondary-font-color);
	}
</style>
