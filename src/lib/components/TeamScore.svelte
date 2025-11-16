<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

	let {
		game,
		home,
		markNumbers = false,
		scorekeeper = false
	}: { game: Game; home: boolean; markNumbers?: boolean; scorekeeper?: boolean } = $props();
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
		background-color: var(--color-white);
		&.top {
			border-radius: 8px 8px 0 0;
		}
		&.bottom {
			border-radius: 0 0 8px 8px;
		}
	}
	.team-score {
		width: 100%;
		font-size: 2rem;
		font-weight: bold;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px 0px;
		gap: 8px;
	}

	.home {
		border-left: 8px solid var(--team-color);
		border-right: 8px solid transparent;
	}
	.away {
		border-right: 8px solid var(--team-color);
		border-left: 8px solid transparent;
	}
	.score {
		font-family: var(--font-mono);
	}
	.team {
		width: 100%;
		font-size: var(--text-xs);
		text-wrap: nowrap;
		overflow: hidden;
		padding: 4px;
	}
</style>
