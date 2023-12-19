<script lang="ts">
	import LoginForm from "$lib/components/LoginForm.svelte"
	import Title from "$lib/components/Title.svelte"
	import Footer from "$lib/components/Footer.svelte"
	export let data
</script>

<div class="page">
	<Title />

	<LoginForm name={data.name} error={data.error} />

	<Footer />
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
