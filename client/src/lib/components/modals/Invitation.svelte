<script lang="ts">
	import { page } from "$app/stores"
	import Modal from "./Modal.svelte"
	import { send_toast } from "../ui/Toast.svelte"

	export let show_invitation_modal: boolean

	async function copy_url() {
		await window.navigator.clipboard.writeText($page.url.href)
		send_toast({
			description: "Copied URL to clipboard!",
			variant: "success",
		})
	}
</script>

<Modal
	open={show_invitation_modal}
	overlay={false}
	with_confirm_button={true}
	confirm_text={"Copy URL"}
	with_cancel_button={true}
	on:confirm={copy_url}
	on:cancel={() => (show_invitation_modal = false)}
>
	<p class="invite_message">Invite others to join the game!</p>
</Modal>

<style>
	.invite_message {
		margin-bottom: 0.75rem;
	}
</style>
