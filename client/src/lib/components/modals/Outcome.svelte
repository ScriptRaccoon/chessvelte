<script lang="ts">
	import Modal from "./Modal.svelte"

	export let show_outcome_modal: boolean
	export let outcome: string
</script>

<Modal
	open={show_outcome_modal && outcome != ""}
	with_confirm_button={true}
	on:confirm={() => (show_outcome_modal = false)}
>
	{outcome}
</Modal>
