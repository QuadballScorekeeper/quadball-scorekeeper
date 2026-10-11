<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';
	import { Modal } from '$lib/components/ui/Modal';
	import { Plus } from '$lib/icons';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data } = $props();
	let tournaments = $derived(data.tournaments);

	let name = $state('');
	let open = $state(false);

	function formatDate(date: Date) {
		return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function formatRange(start: Date, end: Date) {
		const sameDay =
			start.getFullYear() === end.getFullYear() &&
			start.getMonth() === end.getMonth() &&
			start.getDate() === end.getDate();
		return sameDay ? formatDate(start) : `${formatDate(start)} – ${formatDate(end)}`;
	}

	const createTournament: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				open = false;
				name = '';
			}
			await update();
		};
	};
</script>

<NavBar />

<main>
	<h1>Tournaments</h1>

	<Button onclick={() => (open = true)}>
		<Plus />
		New tournament
	</Button>

	<Modal bind:open title="New tournament">
		<form method="POST" use:enhance={createTournament} class="create-form">
			<label for="name">Name</label>
			<input
				id="name"
				name="name"
				type="text"
				placeholder="Tournament name"
				bind:value={name}
				required
			/>
			<div class="actions">
				<Button variant="secondary" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit">Create</Button>
			</div>
		</form>
	</Modal>

	{#if tournaments.length === 0}
		<p class="empty">No tournaments yet — create one to get started.</p>
	{:else}
		<ul class="tournaments">
			{#each tournaments as t (t.id)}
				<li>
					<a href="/admin/{t.id}" class="card">
						<span class="name">{t.name}</span>
						<span class="range">{formatRange(t.start, t.end)}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
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

	.create-form {
		display: grid;
		gap: 0.5rem;
	}

	.create-form label {
		font-size: var(--text-s);
		color: var(--text-subtle);
	}

	.actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.empty {
		color: var(--text-subtle);
	}

	.tournaments {
		display: grid;
		gap: 0.5rem;
		width: 100%;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background-color: var(--surface-0);
		border: 1px solid var(--border-default);
		border-radius: 0.5rem;
		box-shadow: var(--shadow-light);
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.card:hover {
		box-shadow: var(--shadow-interactive);
	}

	.card .name {
		font-weight: 500;
	}

	.card .range {
		font-size: var(--text-s);
		color: var(--text-subtle);
	}
</style>
