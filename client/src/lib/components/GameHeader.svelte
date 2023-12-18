<script lang="ts">
	import Fa from "svelte-fa"
	import { faHome } from "@fortawesome/free-solid-svg-icons"
	import { page } from "$app/stores"
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
	<a href="/">
		<Fa icon={faHome} />
	</a>
</header>

<style>
	header {
		width: var(--width);
		margin-inline: auto;
		text-align: right;
		padding-block: 0.75rem 0.5rem;
		display: flex;
		align-items: center;
	}

	header h1 {
		font-size: 1.25rem;
		font-weight: initial;
	}

	.names {
		font-size: small;
		margin-right: 1rem;
		margin-left: auto;
		color: var(--secondary-font-color);
	}

	a {
		color: var(--secondary-font-color);
	}

	a:hover,
	a:focus-visible {
		color: var(--font-color);
	}
</style>
