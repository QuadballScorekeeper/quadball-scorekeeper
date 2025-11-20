<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

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
	class="team-score"
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
		background-color: light-dark(var(--white), var(--gray-700));
		align-items: center;
		padding: 0.25rem;
	}
	.team {
		background-color: var(--team-color);
		font-size: var(--text-xs);
		text-wrap: nowrap;
		overflow: hidden;
		padding: 0.25rem;
		border-radius: 0.25rem;
	}
</style>
