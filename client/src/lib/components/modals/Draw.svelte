<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import Modal from "./Modal.svelte"

	const dispatch = createEventDispatcher()
	export let show_draw_modal: boolean = false
</script>

<Modal
	open={show_draw_modal}
	with_cancel_button={true}
	with_confirm_button={true}
	confirm_text="Accept"
	cancel_text="Reject"
	on:confirm={() => {
		show_draw_modal = false
		dispatch("accept")
	}}
	on:cancel={() => {
		show_draw_modal = false
		dispatch("reject")
	}}
>
	<p>A draw has been offered.</p>
</Modal>
