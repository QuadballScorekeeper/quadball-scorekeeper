<script lang="ts">
	import Timer from './Timer.svelte';
	import Counter from './Counter.svelte';
	import Penalty from './Penalty.svelte';
	import Timeout from './Timeout.svelte';
	import Catch from './Catch.svelte';
	import { Toggle } from 'flowbite-svelte';
	import { Game } from '$lib/client/Game.svelte';
	import EventsWindow from '../../tournaments/[tournamentId]/game/[gameId]/EventsWindow.svelte';

	let { data } = $props();
	let game = new Game(data.gameData);
	let flip = $state(true);
	let markNumbers = $state(true);
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

<main>
	<Timer {game} />
	{#key flip}
		<div class="flex">
			{@render teamColumn(game, flip)}
			{@render teamColumn(game, !flip)}
		</div>
		<EventsWindow {game} />
	{/key}
	<Toggle bind:checked={flip}>Flip teams</Toggle>
	<Toggle bind:checked={markNumbers}>Player number on goals</Toggle>
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
