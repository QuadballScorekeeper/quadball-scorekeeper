<script lang="ts">
	import { Delete } from '$lib/icons';
	import { Button } from '$lib/components/ui/Button';
	const DEFAULT_TEAM_COLOR = '#808080';

	let { data } = $props();
	let { tournament, teamsWithPlayers } = data;

	function handleColorChange(form: HTMLFormElement) {
		form.requestSubmit();
	}
</script>

<main>
	<h1>{tournament.name}</h1>

	<h2>Add a new team</h2>
	<form method="POST" action="?/newTeam">
		<input type="text" name="teamName" placeholder="Team name" required />
		<div class="color-input">
			<label for="teamColor">Team Color</label>
			<input type="color" name="teamColor" id="teamColor" value={DEFAULT_TEAM_COLOR} required />
		</div>
		<Button type="submit">Add</Button>
	</form>

	<div class="team-list">
		{#each teamsWithPlayers as team (team.id)}
			<div class="team">
				<div class="team-header">
					<strong>{team.name}</strong>
					<form method="POST" action="?/updateTeamColor" class="color-edit-form">
						<input type="hidden" name="teamId" value={team.id} />
						<input
							type="color"
							name="teamColor"
							value={team.color}
							on:change={(e) => handleColorChange(e.currentTarget.form!)}
							title="Change team color"
						/>
					</form>
				</div>

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

	.color-input {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.color-input label {
		font-weight: 500;
	}

	/* Base styles for all color inputs */
	input[type='color'] {
		height: 2rem;
		border-radius: 0.25rem;
		cursor: pointer;
	}

	/* Variant for new team form */
	.color-input input[type='color'] {
		width: 3rem;
	}

	/* Variant for inline editing */
	.color-edit-form input[type='color'] {
		width: 2rem;
		border: 2px solid var(--border-default);
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

	.team-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.color-edit-form {
		display: flex;
		align-items: center;
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
