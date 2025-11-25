<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import EventCard from './EventCard.svelte';

	let { game }: { game: Game } = $props();
	let events = $derived(
		game.events
			.filter((event) => !['pause', 'resume', 'end', 'start'].includes(event.eventType))
			.toReversed()
	);
</script>

<div class="event-window">
	{#each events as event (event.eventNum)}
		<EventCard {game} {event} />
	{/each}
</div>

<style>
	.event-window {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border-radius: 0.5rem;
		border: 0.5rem solid var(--base-disabled);
		overflow-y: auto;
		overflow-x: hidden;
		background-color: var(--base-disabled);
	}
</style>
