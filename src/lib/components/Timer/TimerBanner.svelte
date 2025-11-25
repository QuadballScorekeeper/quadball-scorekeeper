<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { formatGameTime } from '$lib/utils';

	let { game }: { game: Game } = $props();

	const minute = 60 * 1000;
	type TimeEvent = { time: number; event: string };
	const events: TimeEvent[] = [
		{ time: 2.9 * minute, event: 'test-event' },
		{ time: 18 * minute, event: 'flag-release' },
		{ time: 20 * minute, event: 'seeker-release' },
		{ time: 25 * minute, event: 'handicap-1' },
		{ time: 30 * minute, event: 'handicap-2' },
		{ time: 35 * minute, event: 'handicap-3' }
	];
	let nextEvent = $derived(events.find((event) => event.time > game.gameTime));
	let remainingTime = $derived(nextEvent!.time - game.gameTime);
</script>

{#if remainingTime < 2 * minute}
	<div class="banner text-xs {remainingTime < 10 * 1000 ? 'highlight' : ''}">
		<div class="message">{nextEvent!.event}</div>
		{formatGameTime(remainingTime)}
	</div>
{/if}

<style>
	.banner {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--gray-800);
		color: var(--yellow-400);
		width: 100%;
		border-radius: 0.5rem 0.5rem 0 0;
		padding: 0.125rem 0.5rem;
		gap: 1rem;

		&.highlight {
			background-color: var(--yellow-400);
			color: var(--gray-800);
		}
	}
	.message {
		display: flex;
	}
</style>
