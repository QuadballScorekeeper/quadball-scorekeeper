<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { GameEvent } from '$lib/client/GameEvent.svelte';
	import { formatGameTime } from '$lib/utils';

	let { game }: { game: Game } = $props();
	let events = $derived(
		game.events
			.filter((event) => !['pause', 'resume', 'end', 'start'].includes(event.eventType))
			.toReversed()
	);
</script>

{#snippet eventRow(event: GameEvent, home: boolean)}
	<div
		class="event {home ? 'home' : 'away'}"
		dir={home ? 'ltr' : 'rtl'}
		style="--team-color: {home ? game.homeTeam.color : game.awayTeam.color}"
	>
		<div class="event-info">
			{event.getIcon()}
			{event.player ? '#' + event.player : ''}
		</div>
		<div class="score-time" dir="ltr">
			<div>
				{event.score.home}{event.score.catch == 'home' ? '*' : ''}
				-
				{event.score.away}{event.score.catch == 'away' ? '*' : ''}
			</div>
			<div class="text-xs">
				{formatGameTime(event.gameTime)}
			</div>
		</div>
		<div class="event-info"></div>
	</div>
{/snippet}

<div class="event-window">
	{#each events as event (event.eventNum)}
		{@render eventRow(event, event.team == game.homeTeam.id)}
	{/each}
</div>

<style>
	.event-window {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border-radius: 0.5rem;
		border: 0.5rem solid var(--bg-dark);
		overflow: auto;
		background-color: var(--bg-dark);
	}
	.event {
		background-color: var(--bg-light);
		border-radius: 0.25rem;
		padding: 0.25rem 0.5rem;
		display: flex;
		align-items: center;

		&.home {
			border-left: 0.25rem solid var(--team-color);
			border-right: 0.25rem solid transparent;
		}
		&.away {
			border-right: 0.25rem solid var(--team-color);
			border-left: 0.25rem solid transparent;
		}
	}
	.event-info {
		position: relative;
		left: 0;
		flex-grow: 1;
		width: 0;
	}
	.score-time {
		font-family: var(--font-mono);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
