<script lang="ts">
	import Timer from './Timer.svelte';
	import Counter from './Counter.svelte';
	import Penalty from './Penalty.svelte';
	import Timeout from './Timeout.svelte';
	import type { Game } from '$lib/models/Game.svelte';
	import type { Team } from '$lib/models/Team.svelte';
	import { gameAndTeamsFromEvents } from '$lib/buildModels.svelte';
	import EventsWindow from '../../tournaments/[tournamentId]/games/[gameId]/EventsWindow.svelte';
	import Catch from './Catch.svelte';

	let { data } = $props();
	let { gameWithTeams, gameEvents } = data;
	const gameRow = gameWithTeams[0].game;
	const homeTeamRow = gameWithTeams[0].homeTeam;
	const awayTeamRow = gameWithTeams[0].awayTeam;

	const { game, homeTeam, awayTeam }: { game: Game; homeTeam: Team; awayTeam: Team } =
		gameAndTeamsFromEvents(gameRow, homeTeamRow, awayTeamRow, gameEvents);
	console.log('home:', homeTeam);
	console.log('away:', awayTeam);
</script>

{#snippet teamColumn(team: Team)}
	<div class="team-column">
		<h1>{team.name}</h1>
		<Counter {team} />
		<Penalty {team} />
		<Timeout {team} />
		<Catch {team} />
	</div>
{/snippet}

<main>
	<Timer {game} />
	<div class="flex">
		{@render teamColumn(homeTeam)}
		{@render teamColumn(awayTeam)}
	</div>
	<EventsWindow {game} class="h-80 w-80 overflow-auto" />
</main>

<style>
	.team-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		width: 10rem;
		height: 20rem;
	}
</style>
