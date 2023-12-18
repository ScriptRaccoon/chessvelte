<script lang="ts">
	import { TITLE } from "$shared/config"
	import "../app.css"
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta property="og:title" content="Chessvelte" />
	<meta property="og:description" content="Play chess with anyone" />
	<meta name="description" content="Play chess with anyone" />
	<meta property="og:type" content="Website" />
	<meta property="og:url" content="https://chessvelte.netlify.app" />
	<meta property="og:site_name" content="Chessvelte" />
	<meta property="og:image" content="./board.png" />
</svelte:head>

<slot />
