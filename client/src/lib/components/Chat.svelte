<script lang="ts">
	import Fa from "svelte-fa"
	import { faClose } from "@fortawesome/free-solid-svg-icons"
	import { slide } from "svelte/transition"
	import { createEventDispatcher, tick } from "svelte"
	import type { Chat_Message } from "$shared/types"
	import { scroll_to_bottom } from "$shared/utils"

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

	function close() {
		show_chat = false
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
	<section class="chat" transition:slide={{ duration: 100 }}>
		<header>
			<h2>Chat</h2>
			<button class="button small" on:click={close} aria-label="close chat">
				<Fa icon={faClose} />
			</button>
		</header>

		<div class="messages" bind:this={messages_element}>
			{#each messages as message}
				<div>
					{#if message.bot}
						<span class="bot">{message.content}</span>
					{:else}
						<span class="name">{message.name}:</span>
						{message.content}
					{/if}
				</div>
			{/each}
		</div>

		<form on:submit|preventDefault={submit}>
			<input type="text" class="input" bind:value={text} />
			<button class="button">Send</button>
		</form>
	</section>
{/if}

<style>
	section {
		width: var(--width);
		margin-inline: auto;
		padding: 1rem;
		border-radius: 0.25rem;
		background-color: var(--chat-color);
	}

	header {
		padding-bottom: 1rem;
		display: flex;
		justify-content: space-between;
	}

	h2 {
		font-weight: 400;
		font-size: 1.25rem;
	}

	.small {
		scale: 0.75;
	}

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
