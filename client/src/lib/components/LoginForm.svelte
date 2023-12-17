<script lang="ts">
	import { enhance } from "$app/forms"
	import { page } from "$app/stores"
	import type { login_error } from "$shared/types"
	import Card from "./ui/Card.svelte"

	export let name: string = ""
	export let error: login_error

	const ERROR_MESSAGES: Record<login_error, string> = {
		"name": "Name has to be provided",
		"gameid": "Game ID has to be provided",
		"": "",
	}
</script>

<form action="/" method="POST" use:enhance>
	<div class="name_input">
		<label for="name">Your name</label>
		<input
			class="input"
			type="text"
			name="name"
			id="name"
			value={name ?? ""}
			class:error={error === "name"}
		/>
	</div>
	<div class="cards">
		<Card>
			<svelte:fragment slot="heading">Start a new game</svelte:fragment>
			<svelte:fragment slot="cta">
				<button class="button" formaction="?/start">Start</button>
			</svelte:fragment>
		</Card>
		<Card>
			<svelte:fragment slot="heading">Join an existing game</svelte:fragment>
			<svelte:fragment slot="content">
				<label for="game_id">Game ID</label>
				<input
					class="input"
					type="text"
					name="game_id"
					id="game_id"
					value={$page.url.searchParams.get("id") ?? ""}
					autocomplete="off"
					class:error={error === "gameid"}
				/>
			</svelte:fragment>
			<svelte:fragment slot="cta">
				<button class="button" formaction="?/join">Join</button>
			</svelte:fragment>
		</Card>
	</div>

	{#if error.length > 0 && error in ERROR_MESSAGES}
		<div class="error_message">
			{ERROR_MESSAGES[error]}
		</div>
	{/if}
</form>

<style>
	form {
		margin-top: 1rem;
	}
	label {
		margin-right: 0.25rem;
	}
	input.error {
		outline: 0.2rem solid var(--error-color);
	}
	.name_input {
		text-align: center;
	}
	.cards {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
		margin-top: 2rem;
	}

	.error_message {
		text-align: center;
		color: var(--error-color);
		margin-top: 1rem;
	}

	@media (min-width: 48rem) {
		.cards {
			flex-direction: row;
			justify-content: center;
			align-items: stretch;
		}
	}
</style>
