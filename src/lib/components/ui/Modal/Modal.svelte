<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title = null,
		children
	}: { open?: boolean; title?: string | null; children: Snippet } = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => {
		// Covers Esc and programmatic closes, keeping the bound state in sync
		open = false;
	}}
	onclick={(e) => {
		// The dialog element itself is only hit by clicks on the backdrop
		if (e.target === dialog) open = false;
	}}
>
	<div class="modal-content">
		{#if title}
			<h2>{title}</h2>
		{/if}
		{@render children()}
	</div>
</dialog>

<style>
	dialog {
		border: 1px solid var(--border-strong);
		border-radius: 0.5rem;
		background-color: var(--surface-0);
		color: var(--text-default);
		margin: auto;
	}
	dialog::backdrop {
		background-color: rgb(0 0 0 / 0.5);
	}
	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		min-width: 16rem;
	}
	h2 {
		font-size: var(--text-l);
	}
</style>
