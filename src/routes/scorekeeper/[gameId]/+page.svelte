<script lang="ts">
	import Timer from './Timer.svelte';
	import Counter from './Counter.svelte';
	import Penalty from './Penalty.svelte';
	import Timeout from './Timeout.svelte';
	import type { Game } from '$lib/models/Game.svelte';
	import { gameAndTeamsFromEvents } from '$lib/buildModels.svelte';
	import EventsWindow from '../../tournaments/[tournamentId]/games/[gameId]/EventsWindow.svelte';
	import Catch from './Catch.svelte';
	import { Toggle } from 'flowbite-svelte';

	let { data } = $props();
	let { gameInfo } = data;
	let flip = $state(true);
	let markNumbers = $state(true);

	const { game }: { game: Game } = gameAndTeamsFromEvents(gameInfo);
</script>

{#snippet teamColumn(game: Game, home: boolean)}
	<div class="team-column">
		<h1>{home ? game.homeTeam.name : game.awayTeam.name}</h1>
		<Counter {game} {home} {markNumbers} />
		<Penalty {game} {home} />
		<Timeout {game} {home} />
		<Catch {game} {home} {markNumbers} />
	</div>
{/snippet}

{#snippet finishedGame(game: Game)}
	<h1>Game is finished</h1>
	<strong class="font-mono text-5xl">{game.homeTeam.name} - {game.awayTeam.name}</strong>
	<div class="flex">
		<div class="flex items-start">
			<strong class="font-mono text-5xl">{game.homeTeam.score}</strong>
			<strong class="font-mono text-2xl">{game.homeTeam.catch ? '*' : ''}</strong>
		</div>
		<strong class="font-mono text-5xl">-</strong>
		<div class="flex items-start">
			<strong class="font-mono text-5xl">{game.awayTeam.score}</strong>
			<strong class="font-mono text-2xl">{game.awayTeam.catch ? '*' : ''}</strong>
		</div>
	</div>
{/snippet}

<main>
	{#if game.status == 'finished'}
		{@render finishedGame(game)}
	{:else}
		<Timer {game} />
		{#key flip}
			<div class="flex">
				{@render teamColumn(game, flip)}
				{@render teamColumn(game, !flip)}
			</div>
			<EventsWindow {game} {flip} class="h-80 w-80 overflow-auto" />
		{/key}
		<Toggle bind:checked={flip}>Flip teams</Toggle>
		<Toggle bind:checked={markNumbers}>Player number on goals</Toggle>
	{/if}
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
