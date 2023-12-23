<script lang="ts">
	import type { Chat_Message } from "$shared/types"
	import { createEventDispatcher, tick } from "svelte"
	import { scroll_to_bottom } from "$shared/utils"
	import GameCard from "./GameCard.svelte"

	export let messages: Chat_Message[] = []
	export let show_chat: boolean = false

	const dispatch = createEventDispatcher()

	let text: string = ""
	let messages_element: HTMLElement

	function submit() {
		if (!text) return
		dispatch("chat", text)
		text = ""
	}

	$: if (messages.length && messages_element) {
		scroll_down()
	}

	async function scroll_down() {
		await tick()
		scroll_to_bottom(messages_element)
	}
</script>

{#if show_chat}
	<GameCard title="Chat">
		<div class="messages" bind:this={messages_element}>
			{#each messages as message}
				<div>
					{#if message.name}
						<span class="name">{message.name}:</span>
						{message.content}
					{:else}
						<span class="bot">{message.content}</span>
					{/if}
				</div>
			{/each}
		</div>

		<form on:submit|preventDefault={submit}>
			<input type="text" class="input" bind:value={text} />
			<button class="button">Send</button>
		</form>
	</GameCard>
{/if}

<style>
	.messages {
		max-height: 6rem;
		overflow: auto;
		scrollbar-width: thin;
	}

	.messages::-webkit-scrollbar {
		width: 8px;
	}

	.messages::-webkit-scrollbar-thumb {
		background-color: var(--secondary-font-color);
	}

	.name {
		color: var(--secondary-font-color);
	}

	.bot {
		font-style: italic;
	}

	form {
		margin-top: 1rem;
		display: flex;
		gap: 0.5rem;
	}

	input {
		flex-grow: 1;
		padding: 0.2rem;
	}
</style>
