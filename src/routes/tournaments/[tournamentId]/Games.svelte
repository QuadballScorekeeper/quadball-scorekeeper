<script lang="ts">
	import { Game } from '$lib/client/Game.svelte.js';
	import { TabSelect } from '$lib/components/TabSelect';
	import { formatDate } from '$lib/utils';
	import GameCard from './GameCard.svelte';

	let { games }: { games: Game[] } = $props();

	let sortedGames = $derived(
		games.toSorted((a, b) => a.scheduledStart.getTime() - b.scheduledStart.getTime())
	);
	let gameDays = $derived(
		Map.groupBy(sortedGames, ({ scheduledStart }) => formatDate(scheduledStart))
	);

	let tabs = $derived(gameDays.keys().toArray());
	let activeDay = $state<string>();
	let selectedDay = $derived(activeDay ? gameDays.get(activeDay) : undefined);
</script>

{#if tabs.length > 1}
	<div class="day-tabs">
		<TabSelect {tabs} bind:activeTab={activeDay} />
	</div>
{/if}

<div class="game-list">
	{#each selectedDay ?? [] as game (game.id)}
		<GameCard {game} />
	{/each}
</div>

<style>
	.day-tabs {
		padding: 0 1rem;
		width: 100%;
	}

	.game-list {
		width: 100%;
		display: grid;
		gap: 1rem;
		padding: 0 1rem;
		overflow-y: auto;
	}
</style>
