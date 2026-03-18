<script lang="ts">
	import { onMount } from 'svelte';
	import { Game } from '$lib/client/Game.svelte';
	import { GameEvent } from '$lib/client/GameEvent.svelte';
	import { TeamScore } from '$lib/components/TeamScore';
	import { EventWindow } from '$lib/components/EventWindow';
	import { Timer } from '$lib/components/Timer';
	import { NavBar } from '$lib/components/NavBar';

	let { data, params } = $props();
	let game = new Game(data.gameInfo);

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

<NavBar>
	<a href="/tournaments/{data.gameInfo.tournament}">Games</a>
</NavBar>

<main>
	<div class="top">
		<Timer {game} />
		<div class="teams">
			<TeamScore {game} home={true} />
			<TeamScore {game} home={false} />
		</div>
	</div>
	<div class="bottom">
		<EventWindow {game} />
	</div>
</main>

<style>
	main {
		padding: 0;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		align-items: stretch;
	}

	.bottom,
	.top {
		display: flex;
		flex-direction: column;
		padding: 1rem 1.5rem;
		gap: 1rem;
	}

	.bottom {
		background-color: var(--bg-light);
	}

	.teams {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.5rem;
	}
</style>
