<script lang="ts">
	import Modal from "./Modal.svelte"

	export let show_outcome_dialog: boolean
	export let outcome: string
</script>

<Modal
	open={show_outcome_dialog && outcome != ""}
	with_close_button={true}
	on:close={() => (show_outcome_dialog = false)}
>
	<p class="outcome">
		{outcome}
	</p>
</Modal>

<style>
	.outcome {
		font-size: 1.25rem;
	}
</style>
