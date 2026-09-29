<script lang="ts">
	import { Team } from '$lib/client/Team.svelte.js';
	let { teams }: { teams: Team[] } = $props();
</script>

<div class="team-list">
	{#each teams as team (team.id)}
		<details class="team">
			<summary>{team.name}</summary>
			<ul>
				{#each team.players as player (player.number)}
					<li>
						#{player.number} - {player.name}
					</li>
				{/each}
			</ul>
		</details>
	{/each}
</div>

<style>
	.team-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0 1rem;
	}

	.team {
		background-color: light-dark(var(--white), var(--bg-light));
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
	}
</style>
