<script lang="ts">
	import Timer from './Timer.svelte';
	import Counter from './Counter.svelte';
	import Penalty from './Penalty.svelte';
	import Timeout from './Timeout.svelte';
	import type { Game } from '$lib/models/Game.svelte';
	import { gameAndTeamsFromEvents } from '$lib/buildModels.svelte';
	import EventsWindow from '../../tournaments/[tournamentId]/games/[gameId]/EventsWindow.svelte';
	import Catch from './Catch.svelte';
	import { Button, Toggle } from 'flowbite-svelte';

	let { data } = $props();
	let { gameWithTeams, gameEvents } = data;
	let flip = $state(true);
	const gameRow = gameWithTeams[0].game;
	const homeTeamRow = gameWithTeams[0].homeTeam;
	const awayTeamRow = gameWithTeams[0].awayTeam;

	const { game }: { game: Game } = gameAndTeamsFromEvents(
		gameRow,
		homeTeamRow,
		awayTeamRow,
		gameEvents
	);
</script>

{#snippet teamColumn(game: Game, home: boolean)}
	<div class="team-column">
		<h1>{home ? game.homeTeam.name : game.awayTeam.name}</h1>
		<Counter {game} {home} />
		<Penalty {game} {home} />
		<Timeout {game} {home} />
		<Catch {game} {home} />
	</div>
{/snippet}

<main>
	<Timer {game} />
	{#key flip}
		<div class="flex">
			{@render teamColumn(game, flip)}
			{@render teamColumn(game, !flip)}
		</div>
		<EventsWindow {game} {flip} class="h-80 w-80 overflow-auto" />
	{/key}
	<Toggle bind:checked={flip}>Flip teams</Toggle>
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
