<script lang="ts">
	import Header from "$lib/components/Header.svelte"
	import Nav from "$lib/components/Nav.svelte"
	import "../app.css"
</script>

<svelte:head>
	<title>Chessvelte</title>
</svelte:head>

<Nav />
<Header />

<slot />
