<script lang="ts">
	import { Button } from '$lib/components/ui/Button';
	import { Modal } from '$lib/components/ui/Modal';

	let {
		open = $bindable(false),
		title = null,
		message = null,
		confirmLabel = 'Delete',
		onconfirm = null
	}: {
		open?: boolean;
		title?: string | null;
		message?: string | null;
		confirmLabel?: string;
		onconfirm?: (() => void) | null;
	} = $props();
</script>

<Modal bind:open {title}>
	{#if message}
		<p class="message">{message}</p>
	{/if}
	<div class="actions">
		<Button variant="secondary" onclick={() => (open = false)}>Cancel</Button>
		<Button
			variant="destructive"
			onclick={() => {
				open = false;
				onconfirm?.();
			}}>{confirmLabel}</Button
		>
	</div>
</Modal>

<style>
	.message {
		margin: 0;
		color: var(--text-default);
	}

	.actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}
</style>
