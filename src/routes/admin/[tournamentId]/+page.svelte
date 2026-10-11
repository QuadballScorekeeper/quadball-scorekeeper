<script lang="ts">
	import { Button } from '$lib/components/ui/Button';
	import { ConfirmModal } from '$lib/components/ui/Confirm';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data } = $props();
	let tournament = $derived(data.tournament);

	function toDateInput(date: Date) {
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	}

	let name = $state(tournament.name);
	let startString = $state(toDateInput(tournament.start));
	let endString = $state(toDateInput(tournament.end));

	// The bound fields already hold the saved values — the default enhance reset would
	// revert them to their page-load defaults.
	const submitSave: SubmitFunction = () => {
		return async ({ update }) => {
			await update({ reset: false, invalidateAll: true });
		};
	};

	let confirmOpen = $state(false);
	let deleteForm = $state<HTMLFormElement>();
</script>

<main>
	<h1>{tournament.name}</h1>

	<form method="POST" action="?/saveTournament" use:enhance={submitSave} class="card">
		<div class="field">
			<label for="name">Name</label>
			<input type="text" id="name" name="name" bind:value={name} required />
		</div>
		<div class="field">
			<label for="start">Start</label>
			<input name="start" id="start" type="date" bind:value={startString} required />
		</div>
		<div class="field">
			<label for="end">End</label>
			<input name="end" id="end" type="date" bind:value={endString} required />
		</div>
		<Button type="submit">Save</Button>
	</form>

	<form
		method="POST"
		action="?/deleteTournament"
		bind:this={deleteForm}
		use:enhance
		class="delete-form"
	>
		<Button
			variant="destructive"
			type="submit"
			onclick={(e) => {
				e.preventDefault();
				confirmOpen = true;
			}}>Delete tournament</Button
		>
	</form>

	<ConfirmModal
		bind:open={confirmOpen}
		title="Delete tournament"
		message="This permanently deletes {tournament.name} with all its teams, games and recorded
		events. This cannot be undone."
		onconfirm={() => deleteForm?.requestSubmit()}
	/>
</main>

<style>
	h1 {
		font-size: var(--text-xl);
	}

	input {
		border: 1px solid var(--border-strong);
		border-radius: 0.5rem;
		background-color: var(--surface-2);
		padding: 0.25rem 0.5rem;
	}

	.card {
		display: grid;
		gap: 0.75rem;
		width: 100%;
		padding: 1rem;
		background-color: var(--surface-0);
		border: 1px solid var(--border-default);
		border-radius: 0.5rem;
		box-shadow: var(--shadow-light);
	}

	.field {
		display: grid;
		gap: 0.25rem;
	}

	.field label {
		font-size: var(--text-s);
		color: var(--text-subtle);
	}

	.delete-form {
		width: 100%;
	}

	.delete-form :global(button) {
		width: 100%;
	}
</style>
