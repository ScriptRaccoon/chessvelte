<script lang="ts">
	import { browser } from "$app/environment"
	import { STORAGE_KEYS } from "$shared/config"
	import GameCard from "./GameCard.svelte"

	export let show_highlights: boolean = true
	export let show_settings: boolean = false

	function return_to_game() {
		show_settings = false
	}

	function update_highlights() {
		if (!browser) return
		if (!show_highlights) {
			window.localStorage.setItem(STORAGE_KEYS.NO_HIGHLIGHTS, "1")
		} else {
			window.localStorage.removeItem(STORAGE_KEYS.NO_HIGHLIGHTS)
		}
	}
</script>

<GameCard title="Settings">
	<div class="group">
		<label for="highlight_check">Show highlights</label>
		<input
			type="checkbox"
			name="highlight_check"
			id="highlight_check"
			bind:checked={show_highlights}
			on:change={update_highlights}
		/>
	</div>
	<div>
		<button class="button" on:click={return_to_game}>Return</button>
	</div>
</GameCard>

<style>
	.group {
		margin-bottom: 1rem;
	}
	label {
		margin-right: 0.25rem;
	}
</style>
