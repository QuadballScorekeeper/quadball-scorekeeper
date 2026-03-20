<script lang="ts">
	import { onMount } from 'svelte';
	import { Game } from '$lib/client/Game.svelte';
	import { GameEvent } from '$lib/client/GameEvent.svelte';
	import { formatGameTime } from '$lib/utils';
	import { check } from 'drizzle-orm/sqlite-core';

	let { data, params } = $props();
	let game = new Game(data.gameInfo);
	let flipped = $state(false);
	let left = $derived(flipped ? game.awayTeam : game.homeTeam);
	let right = $derived(flipped ? game.homeTeam : game.awayTeam);

	$effect(() => {
		if (game.status == 'live') {
			const freq = 100;
			const interval = setInterval(() => {
				// Calculate elapsed time since last event and update game time
				const elapsedSinceLastEvent = Date.now() - game.getLastEventTime();
				game.gameTime = game.getLastEventGameTime() + elapsedSinceLastEvent;
			}, freq);
			return () => {
				clearInterval(interval);
			};
		}
	});

	// Connect to SSE stream for live updates
	onMount(() => {
		const eventSource = new EventSource(`/api/games/${params.gameId}/stream`);

		eventSource.onmessage = (message) => {
			try {
				const event = GameEvent.from(JSON.parse(message.data));
				game.updateFromEvent(event);
			} catch (err) {
				console.error('Error processing game event:', err);
			}
		};

		eventSource.onerror = (error) => {
			console.error('EventSource connection error, will auto-reconnect:', error);
		};

		return () => {
			eventSource.close();
		};
	});
</script>

<div class="overlay-container">
	<div class="timer-box">
		{formatGameTime(game.gameTime)}
	</div>

	<div class="score-box" style="--left-color: {left.color}; --right-color: {right.color}">
		<span class="acronym">{left.acronym}</span>
		<span class="score">{left.score}</span>
		<span class="score">{right.score}</span>
		<span class="acronym">{right.acronym}</span>
	</div>
	<input type="checkbox" bind:checked={flipped} />Flip teams
</div>

<style>
	.overlay-container {
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: Roboto Mono;
		font-weight: 700;
		color: #fff;
	}

	.timer-box {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #000;
		height: 4rem;
		width: 8rem;
		font-size: 2rem;
	}

	.score-box {
		display: grid;
		grid-template-columns: 5rem 2rem 2rem 5rem;
		padding: 0 1rem;
		height: 4rem;
		align-items: center;
		justify-items: center;
		gap: 1.5rem;
		font-size: 1.75rem;

		background: linear-gradient(
			to right,
			var(--left-color) 0%,
			#000 40%,
			#000 60%,
			var(--right-color) 100%
		);
	}

	.acronym {
		letter-spacing: 0.1em;
		font-family: Roboto;
	}

	.score {
		font-size: 2rem;
		min-width: 2.5rem;
		text-align: center;
	}
</style>
