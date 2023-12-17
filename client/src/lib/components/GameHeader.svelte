<script lang="ts">
	import Fa from "svelte-fa"
	import { faHome } from "@fortawesome/free-solid-svg-icons"
	import { page } from "$app/stores"
	import { TITLE } from "$shared/config"
	$: name = $page.data.name ?? ""
</script>

<header>
	<h1>{TITLE}</h1>
	<div class="secondary">
		{#if name}
			<span class="name">Logged in as {name}</span>
		{/if}
		<a href="/">
			<Fa icon={faHome} />
		</a>
	</div>
</header>

<style>
	header {
		width: var(--width);
		margin-inline: auto;
		text-align: right;
		padding-block: 0.75rem 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	header h1 {
		font-size: 1.25rem;
		font-weight: initial;
	}

	.name {
		font-size: small;
		margin-right: 0.4rem;
	}

	a:hover,
	a:focus-visible {
		color: var(--font-color);
	}

	.secondary {
		color: var(--secondary-font-color);
	}
</style>
