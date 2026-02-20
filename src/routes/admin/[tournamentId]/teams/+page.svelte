<script lang="ts">
	import { DeleteTableOutline } from 'flowbite-svelte-icons';
	let { data } = $props();
	let { tournament, teamsWithPlayers } = data;
</script>

<main class="gap-2">
	<h1>{tournament.name}</h1>

	<h2>Add a new team</h2>
	<form method="POST" action="?/newTeam">
		<input type="text" name="teamName" placeholder="Team name" required class="mb-2" />
		<button class="submit button" type="submit">Add</button>
	</form>

	<div class="team-list">
		{#each teamsWithPlayers as team (team.id)}
			<div class="team">
				<strong>{team.name}</strong>

				<form method="POST" action="?/newPlayer">
					<input type="hidden" name="teamId" value={team.id} />
					<div class="player-info mb-4 grid grid-cols-2 gap-4">
						<input type="number" name="playerNumber" placeholder="Number" required />
						<input type="text" name="playerName" placeholder="Name" required />
					</div>
					<button class="submit button" type="submit">Add</button>
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
						<DeleteTableOutline />
					</button>
				</form>
			</div>
		{/each}
	</div>
</main>

<style>
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
	.submit {
		padding: 0.125rem 0.5rem;
		border-radius: 0.5rem;
	}

	.player-info {
		display: grid;
		grid-template-columns: 5rem 1fr;
	}
	.delete-team {
		color: var(--error);
		width: 2rem;
	}
	input {
		border: 1px solid var(--gray-500);
	}
</style>
