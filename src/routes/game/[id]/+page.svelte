<script lang="ts">
	import { page } from "$app/stores"

	export let data

	let game = data.game

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
	}

	async function send_value(value: number): Promise<void> {
		const response = await fetch("/api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ value, game_id: game.id })
		})
		if (response.ok) {
			const response_data = await response.json()
			game = response_data
		} else {
			window.alert(response.statusText)
		}
	}

	function increment() {
		send_value(1)
	}

	function decrement() {
		send_value(-1)
	}
</script>

<span>
	<a href="/">Home</a>
</span>

<h1>Game {game.id}</h1>

<p>
	<button on:click={copy_url}>Copy URL</button>
</p>

<p>
	Counter: {game.counter}
</p>

<menu>
	<button on:click={increment}>Increment</button>
	<button on:click={decrement}>Decrement</button>
</menu>

<style>
	menu {
		padding: 0;
	}
</style>
