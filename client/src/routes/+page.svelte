<script lang="ts">
	import LoginForm from "$lib/components/LoginForm.svelte"

	export let data
</script>

<LoginForm name={data.name} error={data.error} />
