<script lang="ts">
	import { onMount } from 'svelte';
	import { Game } from '$lib/client/Game.svelte';
	import type { GameEvent } from '$lib/client/GameEvent.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import EventWindow from '$lib/components/EventWindow.svelte';
	import TeamScore from '$lib/components/TeamScore.svelte';

	let { data, params } = $props();
	let game = new Game(data.gameInfo);

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
					game.status = 'timeout';
					break;
				case 'pause':
					game.status = 'paused';
					break;
				case 'resume':
					game.status = 'live';
					break;
				default:
					break;
			}
		};
	});
</script>

<main>
	<div class="container">
		<Timer {game} />
		<div class="teams">
			<TeamScore {game} home={true} />
			<TeamScore {game} home={false} />
		</div>

		<EventWindow {game} />
	</div>
</main>

<style>
	.teams {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 24px;
	}

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
</style>
