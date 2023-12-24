<script lang="ts">
	import LoginForm from "$lib/components/LoginForm.svelte"
	import Title from "$lib/components/Title.svelte"
	import Footer from "$lib/components/Footer.svelte"
	export let data
	export let form
</script>

<div class="page">
	<Title />

	<LoginForm name={data.name} error={form?.error ?? ""} />

	<Footer />
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	@supports (height: 100dvh) {
		.page {
			height: 100dvh;
		}
	}
</style>
