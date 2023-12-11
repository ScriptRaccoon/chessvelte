<script lang="ts">
	import { page } from "$app/stores"

	const game_id = $page.params.id

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
	}

	export let data
</script>

<span>
	<a href="/">Home</a>
</span>

<h1>Game {game_id}</h1>

<p>
	<button on:click={copy_url}>Copy URL</button>
</p>

<p>
	{JSON.stringify(data.game)}
</p>
