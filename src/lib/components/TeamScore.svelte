<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

	let {
		game,
		home,
		scorekeeper = false
	}: { game: Game; home: boolean; scorekeeper?: boolean } = $props();
	let team = home ? game.homeTeam : game.awayTeam;
	const teamClass = home ? 'home' : 'away';

	function scoreGoal() {
		game.addGoal(home);
	}

	function annulGoal() {
		game.removeLastGoal(home);
	}
</script>

<div class="team-score" style="--team-color: {team.color}">
	{#if scorekeeper}
		<button onclick={scoreGoal} class="top {teamClass}">
			<AngleUpOutline class="h-8 w-8" />
			<div class="score">
				{team.score}{team.catch ? '*' : ''}
			</div>
			<div class="team">
				{team.name}
			</div>
		</button>
		<button onclick={annulGoal} class="bottom {teamClass}">
			<AngleDownOutline class="h-8 w-8" />
		</button>
	{:else}
		<div class={teamClass}>
			<div class="score">
				{team.score}{team.catch ? '*' : ''}
			</div>
			<div class="team">
				{team.name}
			</div>
		</div>
	{/if}
</div>

<style>
	.team-score * {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		background-color: light-dark(var(--white), var(--gray-700));
		&.top {
			border-radius: 0.5rem 0.5rem 0 0;
		}
		&.bottom {
			border-radius: 0 0 0.5rem 0.5rem;
		}
	}
	.team-score {
		width: 100%;
		font-size: 2rem;
		font-weight: bold;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 0;
		gap: 0.5rem;
	}

	.home {
		border-left: 0.5rem solid var(--team-color);
		border-right: 0.5rem solid transparent;
	}
	.away {
		border-right: 0.5rem solid var(--team-color);
		border-left: 0.5rem solid transparent;
	}
	.score {
		font-family: var(--font-mono);
	}
	.team {
		width: 100%;
		font-size: var(--text-xs);
		text-wrap: nowrap;
		overflow: hidden;
		padding: 0.25rem;
	}
</style>
