<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import type { Score } from '$lib/client/GameEvent.svelte';
	import { formatGameTime } from '$lib/utils';
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let { game }: { game: Game } = $props();

	let events = $derived(
		game.events.filter((event) => !['pause', 'resume'].includes(event.eventType)).toReversed()
	);
	events = game.events.toReversed();
</script>

{#snippet displayScore(score: Score, team: 'home' | 'away')}
	{#if team == 'home'}
		{score.home}{score.catch == 'home' ? '*' : ''}
	{:else}
		{score.away}{score.catch == 'away' ? '*' : ''}
	{/if}
{/snippet}

<Listgroup class="h-100 w-100 overflow-y-auto">
	{#each events as event (event.eventNum)}
		<ListgroupItem class="flex items-center">
			<div class="flex w-0 grow gap-1">
				{#if event.team == game.homeTeam.id}
					<p>{event.eventType}</p>
					<p>{event.player ?? ''}</p>
				{/if}
			</div>
			<div class="flex flex-col items-center">
				<p class="text-xs text-gray-500">{formatGameTime(event.gameTime)}</p>
				<p>
					{@render displayScore(event.score, 'home')}
					-
					{@render displayScore(event.score, 'away')}
				</p>
			</div>
			<div class="flex w-0 grow justify-end gap-1">
				{#if event.team == game.awayTeam.id}
					<p>{event.player ?? ''}</p>
					<p>{event.eventType}</p>
				{/if}
			</div>
		</ListgroupItem>
	{/each}
</Listgroup>
