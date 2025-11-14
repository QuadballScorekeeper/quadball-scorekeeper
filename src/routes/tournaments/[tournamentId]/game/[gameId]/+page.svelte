<script lang="ts">
	import { formatGameTime } from '$lib/utils';
	import { onMount } from 'svelte';
	import EventsWindow from './EventsWindow.svelte';
	import { Team } from '$lib/client/Team.svelte';
	import { Game } from '$lib/client/Game.svelte';
	import type { GameEvent } from '$lib/client/GameEvent.svelte';

	let { data, params } = $props();
	let game = new Game(data.gameInfo);

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
		if (!game.running) return;
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

	<EventsWindow {game} />
</main>

<style>
</style>
