<script lang="ts">
	import { Game } from '$lib/client/Game.svelte';
	import TeamScore from '$lib/components/TeamScore.svelte';
	import { PauseMenu } from '$lib/components/PauseMenu';
	import { ReleaseCounters } from '$lib/components/RelaseCounters';
	import { Timer } from '$lib/components/Timer';
	import { NavBar } from '$lib/components/NavBar';

	let { data } = $props();
	let game = new Game(data.gameData);

	// Wait for data to load to actually create stuff on the page!
	// Now it jumps from 0 goals and stuff to correct info, ugly!
</script>

{#snippet teamColumn(game: Game, home: boolean)}
	{@const team = home ? game.homeTeam : game.awayTeam}
	<div class="team-column">
		<TeamScore {game} {home} scorekeeper={true} />
		<ReleaseCounters {game} {team} />
	</div>
{/snippet}

<NavBar />
<main>
	<div class="top">
		<Timer {game} scorekeeper={true} />
		<div class="teams">
			{@render teamColumn(game, true)}
			{@render teamColumn(game, false)}
		</div>
	</div>
	<div class="bottom">
		<PauseMenu {game} />
	</div>
</main>

<style>
	main {
		padding: 0;
	}
	.teams {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.5rem;
	}
	.top {
		width: 100%;
		padding: 1rem 1.5rem;
	}
	.bottom {
		width: 100%;
		padding: 0;
		background-color: white;
	}
	.team-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding-bottom: 1.5rem;
	}
</style>
