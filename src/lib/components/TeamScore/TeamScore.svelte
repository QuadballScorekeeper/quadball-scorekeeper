<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';

	let {
		game,
		home,
		scorekeeper = false
	}: { game: Game; home: boolean; scorekeeper?: boolean } = $props();
	let team = home ? game.homeTeam : game.awayTeam;

	function scoreGoal() {
		game.addGoal(home);
	}

	// function annulGoal() {
	// 	game.removeLastGoal(home);
	// }
</script>

<button
	onclick={scoreGoal}
	class="team-score {game.status}"
	style="--team-color: {team.color}"
	disabled={!scorekeeper}
>
	<div class="numeric-xl">
		{team.score}{team.catch ? '*' : ''}
	</div>
	<div class="team">
		{team.name}
	</div>
</button>

<!-- <button onclick={annulGoal} class="bottom {teamClass}">
			<AngleDownOutline class="h-8 w-8" />
		</button> -->

<style>
	.team-score {
		border-radius: 0.5rem;
		background-color: var(--surface-0);
		align-items: center;
		padding: 0.25rem;
		box-shadow: var(--shadow-interactive);
		&.scheduled {
			color: var(--text-disabled);
		}
	}
	.team {
		background-color: var(--team-color);
		color: var(--text-on-color);
		font-size: var(--text-s);
		text-wrap: nowrap;
		overflow: hidden;
		padding: 0.25rem;
		border-radius: 0.25rem;
	}
</style>
