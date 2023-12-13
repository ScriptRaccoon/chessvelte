<script lang="ts">
	import Dialog from "./Dialog.svelte"

	export let alert_message: string | null
</script>

<Dialog
	open={alert_message != null}
	on:close={() => (alert_message = null)}
	with_close_button={true}
>
	<p>
		{alert_message}
	</p>
</Dialog>

<style>
	p {
		margin-top: 0.5rem;
		font-size: 1.5rem;
	}
</style>
