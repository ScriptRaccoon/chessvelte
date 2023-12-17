<script lang="ts">
	import Fa from "svelte-fa"
	import { faHome } from "@fortawesome/free-solid-svg-icons"
	import { page } from "$app/stores"
	$: name = $page.data.name ?? ""
</script>

<nav>
	{#if name}
		<span class="name">Logged in as {name}</span>
	{/if}
	<a href="/">
		<Fa icon={faHome} />
	</a>
</nav>

<style>
	nav {
		text-align: right;
		padding-top: 0.5rem;
		padding-inline: 1rem;
		color: var(--secondary-font-color);
		margin-bottom: -1rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 0.5rem;
	}

	.name {
		font-size: smaller;
	}

	a:hover,
	a:focus-visible {
		color: var(--font-color);
	}
</style>
