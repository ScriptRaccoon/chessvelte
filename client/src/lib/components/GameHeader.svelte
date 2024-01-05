<script lang="ts">
	import Fa from "svelte-fa"
	import { faCog, faHome, faQuestion } from "@fortawesome/free-solid-svg-icons"
	import { TITLE } from "$shared/config"
	import { abridge } from "$shared/utils"

	export let player_names: [string, string] | null = null
	export let toggle_settings: () => void = () => {}
	export let toggle_help: () => void = () => {}

	$: shortened_names = player_names?.map((name) => abridge(name, 9)) ?? null
</script>

<div class="wrapper">
	<h1>{TITLE}</h1>
	<div class="names">
		{#if shortened_names}
			{shortened_names[0]} vs. {shortened_names[1]}
		{/if}
	</div>
	<menu>
		<button
			class="secondary"
			aria-label="toggle settings"
			on:click={toggle_settings}
		>
			<Fa icon={faCog} />
		</button>
		<button class="secondary" aria-label="toggle help" on:click={toggle_help}>
			<Fa icon={faQuestion} />
		</button>
		<a href="/" aria-label="homepage">
			<Fa icon={faHome} />
		</a>
	</menu>
</div>

<style>
	.wrapper {
		display: flex;
		align-items: end;
		padding-block: 1.5rem 0.75rem;
		text-align: right;
	}

	h1 {
		font-size: 1.25rem;
		font-weight: initial;
	}

	.names {
		margin-left: auto;
		color: var(--secondary-font-color);
	}

	menu {
		display: flex;
		gap: 0.75rem;
		margin-left: 1rem;
	}

	@media (min-width: 32rem) {
		h1 {
			font-size: 2rem;
		}
	}
</style>
