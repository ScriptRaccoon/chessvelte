<script lang="ts">
	import { enhance } from "$app/forms"
	import { page } from "$app/stores"

	export let data
</script>

<form action="/" method="POST" use:enhance>
	<p>
		<label for="name">Your name</label>
		<input type="text" name="name" id="name" value={data.name ?? ""} />
	</p>
	<p>
		<label for="game_id">Game ID*</label>
		<input
			type="text"
			name="game_id"
			id="game_id"
			value={$page.url.searchParams.get("id") ?? ""}
			autocomplete="off"
		/>
	</p>
	<p>
		<button class="button">Start</button>
	</p>
</form>

<p>*Leave empty if you want to create a new game</p>
