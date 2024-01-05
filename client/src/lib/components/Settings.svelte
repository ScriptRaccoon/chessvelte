<script lang="ts">
	import { board_theme, highlight_setting } from "$lib/stores"
	import { BOARD_THEMES } from "$shared/config"
	import { capitalize } from "$shared/utils"
	import GameCard from "./GameCard.svelte"

	export let show_settings: boolean = false

	function return_to_game() {
		show_settings = false
	}
</script>

<GameCard title="Settings">
	<div class="group">
		<label for="highlight_check">Show highlights</label>
		<input
			type="checkbox"
			id="highlight_check"
			bind:checked={$highlight_setting}
		/>
	</div>

	<div class="group">
		<label for="theme_select">Board theme</label>

		<select class="select" id="theme_select" bind:value={$board_theme}>
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
		<button class="button" on:click={return_to_game}>Return to the game</button>
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
