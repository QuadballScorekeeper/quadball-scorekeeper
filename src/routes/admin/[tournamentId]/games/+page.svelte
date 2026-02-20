<script lang="ts">
	import { DeleteTableOutline } from 'flowbite-svelte-icons';
	let { data } = $props();
	let { tournament, games, teams } = data;
	let startDate: Date = $state(tournament.start);
	let start = $derived(startDate?.toISOString().split('Z')[0]);
</script>

<main class="gap-2">
	<strong>{tournament.name}</strong>

	Add a new game

	<form method="POST" action="?/newGame">
		<label for="homeTeam">Home team</label>
		<select name="homeTeam" id="homeTeam">
			<option value="">Choose a team</option>
			{#each teams as team, i (i)}
				<option value={team.id}>{team.name}</option>
			{/each}
		</select>
		<label for="awayTeam">Away team</label>
		<select name="awayTeam" id="awayTeam">
			<option value="">Choose a team</option>
			{#each teams as team, i (i)}
				<option value={team.id}>{team.name}</option>
			{/each}
		</select>
		<label for="start">Start</label>
		<input name="start" id="start" type="datetime-local" bind:value={start} />
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
				<form method="POST" action="?/deleteGame">
					<input type="hidden" name="game" value={game.id} />
					<button class="delete-game">
						<DeleteTableOutline />
					</button>
				</form>
			</li>
		{/each}
	</ul>
</main>

<style>
	form {
		display: grid;
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
	.delete-game {
		color: var(--error);
		width: 2rem;
	}
	.team {
		flex-grow: 1;
		flex-basis: 0;
	}
	.time-info {
		width: fit-content;
		flex-basis: 0;
	}
</style>
