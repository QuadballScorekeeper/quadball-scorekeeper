<script lang="ts">
	import { Button } from '$lib/components/ui/Button';
	import { ConfirmModal } from '$lib/components/ui/Confirm';
	import { Delete, Edit, Plus } from '$lib/icons';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	const DEFAULT_TEAM_COLOR = '#808080';
	const ROSTER_PLACEHOLDER = '7 John Smith\n12 Jane Doe';

	let { data, form } = $props();
	let tournament = $derived(data.tournament);
	let teamsWithPlayers = $derived(data.teamsWithPlayers);

	type TeamWithPlayers = (typeof teamsWithPlayers)[number];
	type Player = TeamWithPlayers['players'][number];

	function handleColorChange(formEl: HTMLFormElement) {
		formEl.requestSubmit();
	}

	// Color and team-details forms must not reset — the invalidation already renders the new value.
	const skipReset: SubmitFunction = () => {
		return async ({ update }) => {
			await update({ reset: false, invalidateAll: true });
		};
	};

	// Inline player editing
	let editingPlayerId = $state<number | null>(null);
	let editNumber = $state('');
	let editName = $state('');

	function startEditing(player: Player) {
		editingPlayerId = player.id;
		editNumber = String(player.number);
		editName = player.name;
	}

	const submitPlayerEdit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') editingPlayerId = null;
			await update({ reset: false, invalidateAll: true });
		};
	};

	// Team delete confirmation
	let confirmOpen = $state(false);
	let teamToDelete = $state<TeamWithPlayers | null>(null);
	let deleteForms = $state<Record<number, HTMLFormElement>>({});

	let confirmMessage = $derived(
		teamToDelete
			? `Delete ${teamToDelete.name} and its ${teamToDelete.players.length} players? Teams that are part of a game must have their games deleted first. This cannot be undone.`
			: null
	);
</script>

<main>
	<h1>{tournament.name}</h1>

	{#if form && 'error' in form && form.error}
		<p class="banner error">{form.error}</p>
	{/if}
	{#if form && 'success' in form && form.success}
		<p class="banner success">{form.success}</p>
	{/if}

	<section class="card">
		<h2>Add a new team</h2>
		<form method="POST" action="?/newTeam" use:enhance class="new-team">
			<input type="text" name="teamName" placeholder="Team name" required />
			<input
				type="text"
				name="teamAcronym"
				placeholder="Acronym"
				required
				style="text-transform: uppercase"
			/>
			<input type="color" name="teamColor" value={DEFAULT_TEAM_COLOR} required title="Team color" />
			<Button type="submit"><Plus size={16} />Add team</Button>
		</form>
	</section>

	{#if teamsWithPlayers.length === 0}
		<p class="empty">No teams yet.</p>
	{:else}
		<div class="teams">
			{#each teamsWithPlayers as team (team.id)}
				<section class="card team-card">
					<div class="team-header">
						<form
							method="POST"
							action="?/updateTeamColor"
							use:enhance={skipReset}
							class="color-form"
						>
							<input type="hidden" name="teamId" value={team.id} />
							<input
								type="color"
								name="teamColor"
								value={team.color}
								onchange={(e) => handleColorChange(e.currentTarget.form!)}
								title="Change team color"
							/>
						</form>
						<form method="POST" action="?/updateTeam" use:enhance={skipReset} class="team-details">
							<input type="hidden" name="teamId" value={team.id} />
							<input
								class="name-input"
								type="text"
								name="teamName"
								value={team.name}
								required
								aria-label="Team name"
							/>
							<input
								class="acronym-input"
								type="text"
								name="teamAcronym"
								value={team.acronym}
								style="text-transform: uppercase"
								required
								aria-label="Team acronym"
							/>
							<Button variant="secondary" type="submit">Save</Button>
						</form>
						<form method="POST" action="?/deleteTeam" bind:this={deleteForms[team.id]} use:enhance>
							<input type="hidden" name="team" value={team.id} />
							<button
								class="icon-button danger"
								title="Delete team"
								onclick={(e) => {
									e.preventDefault();
									teamToDelete = team;
									confirmOpen = true;
								}}
							>
								<Delete size={16} />
							</button>
						</form>
					</div>

					{#if team.players.length === 0}
						<p class="no-players">No players yet.</p>
					{:else}
						<ul class="players">
							{#each team.players as player (player.id)}
								<li class="player">
									{#if editingPlayerId === player.id}
										<form
											method="POST"
											action="?/updatePlayer"
											use:enhance={submitPlayerEdit}
											class="player-edit"
										>
											<input type="hidden" name="player" value={player.id} />
											<input
												type="number"
												name="playerNumber"
												bind:value={editNumber}
												min="0"
												required
											/>
											<input type="text" name="playerName" bind:value={editName} required />
											<Button type="submit">Save</Button>
											<Button
												variant="secondary"
												type="button"
												onclick={() => (editingPlayerId = null)}>Cancel</Button
											>
										</form>
									{:else}
										<span class="number">#{player.number}</span>
										<span class="player-name">{player.name}</span>
										<button
											class="icon-button"
											title="Edit player"
											onclick={() => startEditing(player)}
										>
											<Edit size={16} />
										</button>
										<form method="POST" action="?/deletePlayer" use:enhance>
											<input type="hidden" name="player" value={player.id} />
											<button class="icon-button danger" title="Remove player">
												<Delete size={16} />
											</button>
										</form>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}

					<form method="POST" action="?/newPlayer" use:enhance class="new-player">
						<input type="hidden" name="teamId" value={team.id} />
						<input type="number" name="playerNumber" placeholder="Number" min="0" required />
						<input type="text" name="playerName" placeholder="Name" required />
						<Button type="submit" variant="secondary"><Plus size={16} />Add</Button>
					</form>

					<details class="bulk">
						<summary>Paste a full roster</summary>
						<form method="POST" action="?/bulkAddPlayers" use:enhance class="bulk-form">
							<input type="hidden" name="teamId" value={team.id} />
							<textarea name="roster" rows="5" placeholder={ROSTER_PLACEHOLDER}></textarea>
							<Button type="submit" variant="secondary">Add all</Button>
						</form>
					</details>
				</section>
			{/each}
		</div>
	{/if}

	<ConfirmModal
		bind:open={confirmOpen}
		title="Delete team"
		message={confirmMessage}
		onconfirm={() => {
			const t = teamToDelete;
			teamToDelete = null;
			if (t) deleteForms[t.id]?.requestSubmit();
		}}
	/>
</main>

<style>
	h1 {
		font-size: var(--text-xl);
	}

	h2 {
		font-size: var(--text-l);
	}

	input:not([type='color']),
	textarea {
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

	.new-team {
		display: grid;
		grid-template-columns: 1fr 6rem 3rem auto;
		gap: 0.5rem;
	}

	.teams {
		display: grid;
		gap: 1rem;
		width: 100%;
	}

	.team-card {
		gap: 0.5rem;
	}

	.team-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.team-details {
		display: flex;
		flex: 1;
		gap: 0.5rem;
		align-items: center;
		min-width: 0;
	}

	.team-details .name-input {
		flex: 1;
		min-width: 0;
	}

	.team-details .acronym-input {
		width: 6rem;
		flex-shrink: 0;
	}

	.color-form {
		display: flex;
	}

	.color-form input[type='color'] {
		width: 2.25rem;
		height: 2rem;
		border-radius: 0.25rem;
		cursor: pointer;
		padding: 0.25rem;
	}

	.new-team input[type='color'] {
		width: 100%;
		height: auto;
		border-radius: 0.5rem;
		cursor: pointer;
		padding: 0.25rem;
	}

	.players {
		display: grid;
		gap: 0.25rem;
	}

	.player {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.125rem 0.25rem;
		border-radius: 0.375rem;
	}

	.player:hover {
		background-color: var(--surface-1);
	}

	.number {
		font-family: var(--font-mono);
		font-size: var(--text-s);
		color: var(--text-subtle);
		width: 3rem;
		flex-shrink: 0;
	}

	.player-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.player-edit {
		display: flex;
		flex: 1;
		gap: 0.5rem;
		align-items: center;
	}

	.player-edit input[type='number'] {
		width: 4.5rem;
	}

	.player-edit input[type='text'] {
		flex: 1;
		min-width: 0;
	}

	.no-players {
		font-size: var(--text-s);
		color: var(--text-subtle);
	}

	.new-player {
		display: grid;
		grid-template-columns: 5rem 1fr auto;
		gap: 0.5rem;
	}

	.bulk summary {
		font-size: var(--text-s);
		color: var(--text-subtle);
		cursor: pointer;
	}

	.bulk-form {
		display: grid;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.bulk-form textarea {
		resize: vertical;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.375rem;
		cursor: pointer;
		color: var(--text-subtle);
	}

	.icon-button:hover {
		background-color: var(--surface-1);
		color: var(--text-default);
	}

	.icon-button.danger {
		color: var(--error);
	}

	.icon-button.danger:hover {
		background-color: light-dark(var(--red-100), var(--red-900));
	}

	.empty {
		color: var(--text-subtle);
	}

	.banner {
		font-size: var(--text-s);
		padding: 0.5rem;
		width: 100%;
		border-radius: 0.25rem;
	}

	.error {
		color: var(--error);
		background-color: light-dark(var(--red-100), var(--red-900));
	}

	.success {
		color: var(--success);
		background-color: light-dark(var(--green-100), var(--green-900));
	}
</style>
