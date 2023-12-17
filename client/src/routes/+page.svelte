<script lang="ts">
	import LoginForm from "$lib/components/LoginForm.svelte"
	import Title from "$lib/components/Title.svelte"
	export let data
</script>

<Title />

<LoginForm name={data.name} error={data.error} />
