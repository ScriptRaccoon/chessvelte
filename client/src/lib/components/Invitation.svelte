<script lang="ts">
	import { page } from "$app/stores"
	import Modal from "./Modal.svelte"
	import { send_toast } from "./Toast.svelte"

	export let is_started: boolean = false

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
		send_toast({
			description: "Copied URL to clipboard!",
			variant: "success",
		})
	}
</script>

<Modal open={!is_started}>
	<p class="invite_message">Invite others to join the game!</p>
	<p>
		<button class="button" on:click={copy_url}>Copy URL</button>
	</p>
</Modal>

<style>
	.invite_message {
		margin-bottom: 0.75rem;
	}
</style>
