<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { GameEvent } from '$lib/client/GameEvent.svelte';
	import { formatGameTime } from '$lib/utils';
	import EventModal from './EventModal.svelte';

	let {
		game,
		event,
		scorekeeper = false
	}: { game: Game; event: GameEvent; scorekeeper?: boolean } = $props();
	const home = $derived(game.homeTeam.id == event.teamId);
	const team = $derived(home ? game.homeTeam : game.awayTeam);

	let open = $state(false);

	function openModal() {
		if (!scorekeeper) {
			return;
		}
		open = true;
	}
</script>

<div>
	<button
		class="event {home ? 'home' : 'away'}"
		style="--team-color: {team.color}"
		onclick={openModal}
	>
		<div class="info-home">
			{#if home}
				{event.getIcon()}
				{event.playerNumber ? '#' + event.playerNumber : ''}
			{/if}
		</div>
		<div class="score-time">
			<div>
				{event.score.home}{event.score.catch == 'home' ? '*' : ''}
				-
				{event.score.away}{event.score.catch == 'away' ? '*' : ''}
			</div>
			<div class="time-text">
				{formatGameTime(event.gameTime)}
			</div>
		</div>
		<div class="info-away">
			{#if !home}
				{event.playerNumber ? '#' + event.playerNumber : ''}
				{event.getIcon()}
			{/if}
		</div>
	</button>

	<EventModal bind:open {game} {event} />
</div>

<style>
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

	.time-text {
		font-size: var(--text-xs);
	}
</style>
