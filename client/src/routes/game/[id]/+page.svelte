<script lang="ts">
	import App from "./App.svelte"

	export let data

	const { game_id, client_id } = data
</script>

<App {game_id} {client_id} />
