<script lang="ts">
	import Fa from "svelte-fa"
	import { faHome } from "@fortawesome/free-solid-svg-icons"
	import { TITLE } from "$shared/config"

	export let player_names: [string, string] | null = null
</script>

<header>
	<h1>{TITLE}</h1>
	<div class="names">
		{#if player_names}
			{player_names[0]} vs. {player_names[1]}
		{/if}
	</div>
	<a href="/" aria-label="homepage">
		<Fa icon={faHome} />
	</a>
</header>

<style>
	header {
		display: flex;
		align-items: end;
		padding-block: 1.5rem 0.75rem;
		text-align: right;
	}

	header h1 {
		font-size: 1.25rem;
		font-weight: initial;
	}

	.names {
		margin-right: 0.5rem;
		margin-left: auto;
		color: var(--secondary-font-color);
	}

	@media (min-width: 32rem) {
		header h1 {
			font-size: 2rem;
		}
	}
</style>
