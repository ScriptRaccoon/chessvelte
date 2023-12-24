<script lang="ts">
	import { browser } from "$app/environment"
	import { BOARD_THEMES, DEFAULT_THEME, STORAGE_KEYS } from "$shared/config"
	import { capitalize, set_theme } from "$shared/utils"
	import GameCard from "./GameCard.svelte"

	export let show_highlights: boolean = true
	export let show_settings: boolean = false

	export let current_theme: string = DEFAULT_THEME

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

	function update_theme() {
		if (!browser) return
		set_theme(current_theme)
	}
</script>

<GameCard title="Settings">
	<div class="group">
		<label for="highlight_check">Show highlights</label>
		<input
			type="checkbox"
			id="highlight_check"
			bind:checked={show_highlights}
			on:change={update_highlights}
		/>
	</div>

	<div class="group">
		<label for="theme_select">Board theme</label>

		<select
			class="select"
			id="theme_select"
			bind:value={current_theme}
			on:change={update_theme}
		>
			{#each BOARD_THEMES as theme}
				<option value={theme}>{capitalize(theme)}</option>
			{/each}
		</select>

		<div class="preview">
			<span class="light"></span>
			<span class="dark"></span>
			<span class="dark"></span>
			<span class="light"></span>
		</div>
	</div>

	<div>
		<button class="button" on:click={return_to_game}>Return</button>
	</div>
</GameCard>

<style>
	.group {
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
	}

	label {
		margin-right: 0.25rem;
	}

	.preview {
		margin-left: 1rem;
		width: 2rem;
		height: 2rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
		border-radius: 0.2rem;
		overflow: hidden;
	}

	.preview > * {
		transition: background-color 80ms linear;
	}

	.preview > .light {
		background-color: var(--light-square-color);
	}

	.preview > .dark {
		background-color: var(--dark-square-color);
	}
</style>
