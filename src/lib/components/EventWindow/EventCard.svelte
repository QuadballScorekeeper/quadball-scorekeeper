<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { GameEvent } from '$lib/client/GameEvent.svelte';
	import { formatGameTime } from '$lib/utils';
	import { Button } from '$lib/components/ui/Button';
	import { Delete, Edit } from '$lib/icons';

	let { game, event }: { game: Game; event: GameEvent } = $props();
	const home = game.homeTeam.id == event.team;

	let slide = $state(false);
</script>

<div class="event-container" class:slide>
	<button
		class="event {home ? 'home' : 'away'}"
		style="--team-color: {home ? game.homeTeam.color : game.awayTeam.color}"
		onclick={() => (slide = !slide)}
	>
		<div class="info-home">
			{#if home}
				{event.getIcon()}
				{event.player ? '#' + event.player : ''}
			{/if}
		</div>
		<div class="score-time">
			<div>
				{event.score.home}{event.score.catch == 'home' ? '*' : ''}
				-
				{event.score.away}{event.score.catch == 'away' ? '*' : ''}
			</div>
			<div class="text-xs">
				{formatGameTime(event.gameTime)}
			</div>
		</div>
		<div class="info-away">
			{#if !home}
				{event.player ? '#' + event.player : ''}
				{event.getIcon()}
			{/if}
		</div>
	</button>
	<div class="button-group">
		<Button
			onclick={() => {
				game.removeEvent(event.eventNum);
			}}
			type="destructive"
		>
			<Delete />
		</Button>
		<Button type="secondary">
			<Edit />
		</Button>
	</div>
</div>

<style>
	.event-container {
		display: grid;
		grid-template-columns: 1fr 0;
		transition: transform 200ms;
		&.slide {
			transform: translate(-6.5rem, 0);
		}
	}
	.button-group {
		display: flex;
		gap: 0.5rem;
		padding: 0.25rem 0.75rem;
	}

	.event {
		background-color: var(--surface-0);
		border-radius: 0.25rem;
		padding: 0.25rem 0.5rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		width: 100%;

		&.home {
			border-left: 0.25rem solid var(--team-color);
			border-right: 0.25rem solid transparent;
		}
		&.away {
			border-right: 0.25rem solid var(--team-color);
			border-left: 0.25rem solid transparent;
		}
	}
	.info-home {
		text-align: left;
	}
	.info-away {
		text-align: right;
	}
	.score-time {
		font-family: var(--font-mono);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
