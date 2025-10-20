<script lang="ts">
	import { gameAndTeamsFromEvents } from '$lib/buildModels.svelte';
	import type { Game } from '$lib/models/Game.svelte';
	import { GameEvent } from '$lib/models/GameEvent.svelte.js';
	import type { Team } from '$lib/models/Team.svelte';
	import { formatGameTime } from '$lib/utils';
	import { onMount } from 'svelte';
	import EventsWindow from './EventsWindow.svelte';

	let { data, params } = $props();
	let { gameWithTeams, gameEvents } = data;
	const gameRow = gameWithTeams[0].game;
	const homeTeamRow = gameWithTeams[0].homeTeam;
	const awayTeamRow = gameWithTeams[0].awayTeam;

	const { game }: { game: Game } = gameAndTeamsFromEvents(
		gameRow,
		homeTeamRow,
		awayTeamRow,
		gameEvents
	);

	$effect(() => {
		if (game.running) {
			const freq = 100;
			const interval = setInterval(() => {
				game.gameTime += freq;
			}, freq);
			return () => {
				clearInterval(interval);
			};
		}
	});

	onMount(() => {
		const eventSource = new EventSource(`/api/games/${params.gameId}/stream`);
		eventSource.onmessage = (message) => {
			const event: GameEvent = JSON.parse(message.data);
			game.events.push(event);
			switch (event.eventType) {
				case 'goal':
					if (event.team == game.homeTeam.id) game.homeTeam.goals++;
					if (event.team == game.awayTeam.id) game.awayTeam.goals++;
					break;
				case 'timeout':
				case 'pause':
					game.running = false;
					break;
				case 'resume':
					game.running = true;
					break;
				default:
					break;
			}
		};
	});
</script>

{#snippet teamScore(team: Team)}
	<div class="flex items-start">
		<strong class="font-mono text-5xl">{team.score}</strong>
		<strong class="font-mono text-2xl">{team.catch ? '*' : ''}</strong>
	</div>
{/snippet}

<main>
	<div class="flex gap-40">
		<h1>{game.homeTeam.name}</h1>
		<h1>{game.awayTeam.name}</h1>
	</div>
	<div class="flex flex-col items-center gap-1">
		<strong class="font-mono text-2xl">{formatGameTime(game.gameTime)}</strong>
		<div class="flex items-center gap-4">
			{@render teamScore(game.homeTeam)}
			<strong class="font-mono text-5xl">-</strong>
			{@render teamScore(game.awayTeam)}
		</div>
	</div>

	<EventsWindow {game} flip={true} class="h-80 w-80 overflow-auto" />
</main>

<style>
</style>
