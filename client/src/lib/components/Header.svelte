<script lang="ts">
	import Fa from "svelte-fa"
	import { faHome } from "@fortawesome/free-solid-svg-icons"
</script>

<header>
	<nav>
		<a href="/">
			<Fa icon={faHome} />
		</a>
	</nav>
	<h1>Chessvelte</h1>
	<p>Play chess with anyone</p>
</header>

<style>
	nav {
		text-align: right;
		padding-inline: 1rem;
	}
	a {
		color: var(--secondary-font-color);
	}

	a:hover,
	a:focus-visible {
		color: var(--font-color);
	}

	header {
		padding-block: 1rem;
		text-align: center;
	}
	h1 {
		font-weight: 400;
		margin-top: -0.5rem;
		font-size: 2.25rem;
	}

	p {
		margin-top: 0.25rem;
		font-style: italic;
		color: var(--secondary-font-color);
	}
</style>
