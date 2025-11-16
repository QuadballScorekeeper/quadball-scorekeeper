<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import { Game } from '$lib/client/Game.svelte';
	import TeamScore from '$lib/components/TeamScore.svelte';
	import PauseMenu from '$lib/components/PauseMenu.svelte';
	import ReleaseCounters from '$lib/components/ReleaseCounters.svelte';

	let { data } = $props();
	let game = new Game(data.gameData);
	let markNumbers = $state(false);
	// Wait for data to load to actually create stuff on the page!
	// Now it jumps from 0 goals and stuff to correct info, ugly!
</script>

{#snippet teamColumn(game: Game, home: boolean)}
	{@const team = home ? game.homeTeam : game.awayTeam}
	<div class="team-column">
		<TeamScore {game} {home} {markNumbers} scorekeeper={true} />
		<ReleaseCounters {game} {team} />
	</div>
{/snippet}

<main>
	<div class="container">
		<Timer {game} scorekeeper={true} />
		<div class="teams">
			{@render teamColumn(game, true)}
			{@render teamColumn(game, false)}
		</div>
		<PauseMenu {game} />
	</div>
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		max-width: 560px;
		min-width: 320px;
		padding: 24px;
	}

	.teams {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 24px;
	}
	.team-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding-bottom: 24px;
	}
</style>
