<script lang="ts">
	import { Button } from '$lib/components/ui/Button';
	import { ConfirmModal } from '$lib/components/ui/Confirm';
	import { Delete, Minus, Plus } from '$lib/icons';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { SvelteDate } from 'svelte/reactivity';

	// A new game is scheduled one slot after the last game on the list.
	const SLOT_MINUTES = 60;
	const STEP_MINUTES = 15;

	let { data, form } = $props();
	let tournament = $derived(data.tournament);
	let games = $derived(data.games);
	let teams = $derived(data.teams);

	type Game = (typeof games)[number];

	function toDateTimeInput(date: Date) {
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}

	function formatTime(date: Date) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function formatDay(date: Date) {
		return date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' });
	}

	function isSameDay(a: Date, b: Date) {
		return (
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	// Games are ordered by scheduledStart, so consecutive games share a day group.
	let days = $derived(groupByDay(games));

	function groupByDay(list: Game[]) {
		const groups: { date: Date; games: Game[] }[] = [];
		for (const g of list) {
			const last = groups.at(-1);
			if (last && isSameDay(last.date, g.scheduledStart)) {
				last.games.push(g);
			} else {
				groups.push({ date: g.scheduledStart, games: [g] });
			}
		}
		return groups;
	}

	let lastGame = $derived(games.at(-1));
	let defaultStart = $derived(nextSlotStart(lastGame, tournament.start));

	function nextSlotStart(last: Game | undefined, fallback: Date): Date {
		return last ? new SvelteDate(last.scheduledStart.getTime() + SLOT_MINUTES * 60_000) : fallback;
	}

	// With exactly two teams every game is the same matchup — preselect it.
	let homeTeam = $state(teams.length === 2 ? String(teams[0].id) : '');
	let awayTeam = $state(teams.length === 2 ? String(teams[1].id) : '');
	let startInput = $state(toDateTimeInput(defaultStart));

	function nudgeStart(minutes: number) {
		const d = new SvelteDate(startInput);
		if (Number.isNaN(d.getTime())) return;
		d.setMinutes(d.getMinutes() + minutes);
		startInput = toDateTimeInput(d);
	}

	function resetTeamSelections() {
		if (teams.length === 2) {
			homeTeam = String(teams[0].id);
			awayTeam = String(teams[1].id);
		} else {
			homeTeam = '';
			awayTeam = '';
		}
	}

	const submitNewGame: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: true });
				// The fresh data has a new last game — prefill the next slot.
				startInput = toDateTimeInput(defaultStart);
				resetTeamSelections();
			} else {
				await update();
			}
		};
	};

	// Inline rescheduling
	let editingGameId = $state<number | null>(null);
	let editStart = $state('');

	function startEditing(game: Game) {
		editingGameId = game.id;
		editStart = toDateTimeInput(game.scheduledStart);
	}

	const submitTimeEdit: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') editingGameId = null;
			await update({ reset: false });
		};
	};

	// Delete confirmation
	let confirmOpen = $state(false);
	let gameToDelete = $state<Game | null>(null);
	let deleteForms = $state<Record<number, HTMLFormElement>>({});

	let confirmMessage = $derived(
		gameToDelete
			? `Delete ${gameToDelete.homeTeam.name} vs ${gameToDelete.awayTeam.name}? All its recorded events will be removed. This cannot be undone.`
			: null
	);
</script>

<main>
	<h1>{tournament.name}</h1>

	<section class="card">
		<h2>Add a new game</h2>
		{#if teams.length < 2}
			<p class="empty">
				You need at least two teams to schedule a game — <a href="../teams">add teams first</a>.
			</p>
		{:else}
			<form method="POST" action="?/newGame" use:enhance={submitNewGame} class="new-game">
				<div class="field">
					<label for="homeTeam">Home team</label>
					<select name="homeTeam" id="homeTeam" bind:value={homeTeam} required>
						<option value="" disabled selected hidden>Choose a team</option>
						{#each teams as team (team.id)}
							<option value={team.id}>{team.acronym} — {team.name}</option>
						{/each}
					</select>
				</div>
				<div class="field">
					<label for="awayTeam">Away team</label>
					<select name="awayTeam" id="awayTeam" bind:value={awayTeam} required>
						<option value="" disabled selected hidden>Choose a team</option>
						{#each teams as team (team.id)}
							<option value={team.id}>{team.acronym} — {team.name}</option>
						{/each}
					</select>
				</div>
				<div class="field">
					<label for="start">Start</label>
					<div class="start-row">
						<input name="start" id="start" type="datetime-local" bind:value={startInput} required />
						<div class="steppers">
							<button
								type="button"
								onclick={() => nudgeStart(-STEP_MINUTES)}
								title="{STEP_MINUTES} minutes earlier"
							>
								<Minus size={16} />{STEP_MINUTES}m
							</button>
							<button
								type="button"
								onclick={() => nudgeStart(STEP_MINUTES)}
								title="{STEP_MINUTES} minutes later"
							>
								<Plus size={16} />{STEP_MINUTES}m
							</button>
						</div>
					</div>
				</div>
				<Button type="submit">Add game</Button>
			</form>
		{/if}
	</section>

	{#if form && 'error' in form && form.error}
		<p class="banner error">{form.error}</p>
	{/if}
	{#if form && 'success' in form && form.success}
		<p class="banner success">{form.success}</p>
	{/if}

	{#if games.length === 0}
		<p class="empty">No games yet.</p>
	{:else}
		<div class="days">
			{#each days as day (day.date.getTime())}
				<section class="day">
					<h3>{formatDay(day.date)}</h3>
					<ul>
						{#each day.games as game (game.id)}
							<li class="game-row">
								{#if editingGameId === game.id}
									<form
										method="POST"
										action="?/updateGameStart"
										use:enhance={submitTimeEdit}
										class="time-edit"
									>
										<input type="hidden" name="game" value={game.id} />
										<input type="datetime-local" name="start" bind:value={editStart} required />
										<Button type="submit">Save</Button>
										<Button
											variant="secondary"
											type="button"
											onclick={() => (editingGameId = null)}
										>
											Cancel
										</Button>
									</form>
								{:else}
									<span class="team home">
										<span class="dot" style:background-color={game.homeTeam.color}></span>
										<span class="acronym">{game.homeTeam.acronym}</span>
										<span class="name">{game.homeTeam.name}</span>
									</span>
									<button class="time" title="Reschedule" onclick={() => startEditing(game)}>
										{formatTime(game.scheduledStart)}
									</button>
									<span class="team away">
										<span class="dot" style:background-color={game.awayTeam.color}></span>
										<span class="acronym">{game.awayTeam.acronym}</span>
										<span class="name">{game.awayTeam.name}</span>
									</span>
									<a href="/scorekeeper/{game.id}" class="scorekeep-link">Scorekeep</a>
									<form
										method="POST"
										action="?/deleteGame"
										bind:this={deleteForms[game.id]}
										use:enhance
									>
										<input type="hidden" name="game" value={game.id} />
										<button
											class="icon-button danger"
											title="Delete game"
											onclick={(e) => {
												e.preventDefault();
												gameToDelete = game;
												confirmOpen = true;
											}}
										>
											<Delete size={16} />
										</button>
									</form>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/if}

	<ConfirmModal
		bind:open={confirmOpen}
		title="Delete game"
		message={confirmMessage}
		onconfirm={() => {
			const g = gameToDelete;
			gameToDelete = null;
			if (g) deleteForms[g.id]?.requestSubmit();
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

	h3 {
		font-size: var(--text-s);
		color: var(--text-subtle);
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

	.new-game {
		display: grid;
		gap: 0.75rem;
	}

	.field {
		display: grid;
		gap: 0.25rem;
	}

	.field label {
		font-size: var(--text-s);
		color: var(--text-subtle);
	}

	input,
	select {
		border: 1px solid var(--border-strong);
		border-radius: 0.5rem;
		background-color: var(--surface-2);
		padding: 0.25rem 0.5rem;
	}

	.start-row {
		display: flex;
		gap: 0.5rem;
	}

	.start-row input {
		flex: 1;
		min-width: 0;
	}

	.steppers {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.25rem;
	}

	.steppers button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		font-size: var(--text-s);
		background-color: var(--surface-2);
		border: 1px solid var(--border-default);
		border-radius: 0.5rem;
		cursor: pointer;
		white-space: nowrap;
	}

	.steppers button:hover {
		background-color: var(--surface-1);
	}

	.dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		border: 1px solid var(--border-default);
		flex-shrink: 0;
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

	.days {
		display: grid;
		gap: 1rem;
		width: 100%;
	}

	.day ul {
		display: grid;
		gap: 0.5rem;
	}

	.game-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--surface-0);
		border: 1px solid var(--border-default);
		border-radius: 0.5rem;
		box-shadow: var(--shadow-light);
	}

	.team {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		flex: 1 1 0;
		min-width: 0;
	}

	.team.away {
		justify-content: flex-end;
	}

	.acronym {
		font-size: var(--text-s);
		color: var(--text-subtle);
		flex-shrink: 0;
	}

	.name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.time {
		font-family: var(--font-mono);
		font-size: var(--text-s);
		color: var(--text-default);
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
		cursor: pointer;
		text-decoration: underline dotted var(--border-strong);
		text-underline-offset: 0.2em;
		white-space: nowrap;
	}

	.time:hover {
		background-color: var(--surface-1);
	}

	.time-edit {
		display: flex;
		flex: 1;
		gap: 0.5rem;
		align-items: center;
	}

	.time-edit input {
		flex: 1;
		min-width: 0;
	}

	.scorekeep-link {
		padding: 0.25rem 0.5rem;
		font-size: var(--text-s);
		color: var(--info);
		border-radius: 0.25rem;
		white-space: nowrap;
	}

	.scorekeep-link:hover {
		background-color: var(--surface-1);
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.375rem;
		cursor: pointer;
	}

	.icon-button.danger {
		color: var(--error);
	}

	.icon-button.danger:hover {
		background-color: light-dark(var(--red-100), var(--red-900));
	}
</style>
