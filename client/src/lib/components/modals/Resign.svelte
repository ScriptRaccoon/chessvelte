<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import Modal from "./Modal.svelte"

	const dispatch = createEventDispatcher()
	export let show_resign_modal: boolean = false
</script>

<Modal
	open={show_resign_modal}
	with_cancel_button={true}
	with_close_button={true}
	on:close={() => {
		show_resign_modal = false
		dispatch("resign")
	}}
	on:cancel={() => {
		show_resign_modal = false
	}}
>
	<p>Are you sure that you want to resign?</p>
</Modal>
