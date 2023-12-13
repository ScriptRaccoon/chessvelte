<script lang="ts">
	import Header from "$lib/components/Header.svelte"
	import "../app.css"
</script>

<svelte:head>
	<title>Chessvelte</title>
</svelte:head>

<Header />

<slot />
