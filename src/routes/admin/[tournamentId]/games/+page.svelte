<script lang="ts">
	import { Delete } from '$lib/icons';
	let { data, form } = $props();
	let tournament = $derived(data.tournament);
	let games = $derived(data.games);
	let teams = $derived(data.teams);
	let startDate: Date = $derived(tournament.start);
	let start = $derived(startDate?.toISOString().split('Z')[0]);

	let copiedCode = $state<string | null>(null);

	function copyCode(code: string) {
		navigator.clipboard.writeText(code);
		copiedCode = code;
		setTimeout(() => {
			copiedCode = null;
		}, 2000);
	}
</script>

<main>
	<strong>{tournament.name}</strong>

	Add a new game

	<form method="POST" action="?/newGame">
		<label for="homeTeam">Home team</label>
		<select name="homeTeam" id="homeTeam" required>
			<option value="">Choose a team</option>
			{#each teams as team, i (i)}
				<option value={team.id}>{team.name}</option>
			{/each}
		</select>
		<label for="awayTeam">Away team</label>
		<select name="awayTeam" id="awayTeam" required>
			<option value="">Choose a team</option>
			{#each teams as team, i (i)}
				<option value={team.id}>{team.name}</option>
			{/each}
		</select>
		<label for="start">Start</label>
		<input name="start" id="start" type="datetime-local" bind:value={start} required />

		{#if form && 'error' in form}
			<p class="error">{form.error}</p>
		{/if}

		{#if form && 'success' in form && 'code' in form}
			<p class="success">Game created! Code: <strong>{form.code}</strong></p>
		{/if}

		<button type="submit">Add game</button>
	</form>

	<ul>
		{#each games as game, i (i)}
			<li>
				<div class="team">
					{game.homeTeam.name}
				</div>
				<div class="time-info">
					{game.start.toLocaleString()}
				</div>
				<div class="team" dir="rtl">
					{game.awayTeam.name}
				</div>
				<div class="game-code">
					<code>{game.code}</code>
					<button
						type="button"
						class="copy-btn"
						onclick={() => copyCode(game.code)}
						title="Copy code"
					>
						{copiedCode === game.code ? '✓' : '📋'}
					</button>
				</div>
				<a href="/scorekeeper/{game.id}" class="scorekeep-link">Scorekeep</a>
				<form method="POST" action="?/deleteGame">
					<input type="hidden" name="game" value={game.id} />
					<button class="delete-game">
						<Delete />
					</button>
				</form>
			</li>
		{/each}
	</ul>
</main>

<style>
	main {
		gap: 0.5rem;
	}

	form {
		display: grid;
		gap: 0.5rem;
	}

	.error {
		color: var(--error);
		font-size: var(--text-s);
		padding: 0.5rem;
		background-color: light-dark(var(--red-100), var(--red-900));
		border-radius: 0.25rem;
	}

	.success {
		color: var(--success);
		font-size: var(--text-s);
		padding: 0.5rem;
		background-color: light-dark(var(--green-100), var(--green-900));
		border-radius: 0.25rem;
	}

	ul {
		display: grid;
		gap: 0.25rem;
		width: 100%;
		overflow-y: auto;
	}

	li {
		display: flex;
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
		gap: 0.5rem;
		align-items: center;
	}

	.team {
		flex-grow: 1;
		flex-basis: 0;
	}

	.time-info {
		width: fit-content;
		flex-basis: 0;
	}

	.game-code {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background-color: var(--surface-1);
		border-radius: 0.25rem;
	}

	code {
		font-family: var(--font-mono);
		font-size: var(--text-s);
		font-weight: 600;
		letter-spacing: 0.05rem;
	}

	.copy-btn {
		padding: 0.25rem;
		font-size: 0.875rem;
		background: none;
		border: none;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.copy-btn:hover {
		opacity: 1;
	}

	.scorekeep-link {
		padding: 0.25rem 0.5rem;
		font-size: var(--text-s);
		color: var(--blue-600);
		text-decoration: none;
		border-radius: 0.25rem;
		transition: background-color 0.2s;
	}

	.scorekeep-link:hover {
		background-color: var(--surface-1);
	}

	.delete-game {
		color: var(--error);
		width: 2rem;
	}
</style>
