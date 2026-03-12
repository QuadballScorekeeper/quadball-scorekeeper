<script lang="ts">
	import { Delete } from '$lib/icons';
	import { Button } from '$lib/components/ui/Button';
	let { data } = $props();
	let { tournament, teamsWithPlayers } = data;
</script>

<main>
	<h1>{tournament.name}</h1>

	<h2>Add a new team</h2>
	<form method="POST" action="?/newTeam">
		<input type="text" name="teamName" placeholder="Team name" required />
		<Button type="submit">Add</Button>
	</form>

	<div class="team-list">
		{#each teamsWithPlayers as team (team.id)}
			<div class="team">
				<strong>{team.name}</strong>

				<form method="POST" action="?/newPlayer">
					<input type="hidden" name="teamId" value={team.id} />
					<div class="player-info">
						<input type="number" name="playerNumber" placeholder="Number" required />
						<input type="text" name="playerName" placeholder="Name" required />
					</div>
					<Button type="submit">Add</Button>
				</form>
				<ul>
					{#each team.players as player (player.number)}
						<li>
							#{player.number} - {player.name}
						</li>
					{/each}
				</ul>
				<form method="POST" action="?/deleteTeam">
					<input type="hidden" name="team" value={team.id} />
					<button class="delete-team">
						<Delete />
					</button>
				</form>
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		gap: 0.5rem;
	}

	form input[name='teamName'] {
		margin-bottom: 0.5rem;
	}

	.team-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.team {
		background-color: var(--bg-light);
		border-radius: 0.5rem;
		padding: 0.5rem;
	}

	.player-info {
		display: grid;
		grid-template-columns: 5rem 1fr;
		margin-bottom: 1rem;
		gap: 1rem;
	}
	.delete-team {
		color: var(--error);
		width: 2rem;
	}
	input {
		border: 1px solid var(--gray-500);
	}
</style>
