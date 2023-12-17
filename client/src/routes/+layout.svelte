<script lang="ts">
	import { TITLE } from "$shared/config"
	import "../app.css"
</script>

<svelte:head>
	<title>{TITLE}</title>
</svelte:head>

<slot />
