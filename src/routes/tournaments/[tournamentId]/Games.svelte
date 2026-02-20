<script lang="ts">
	import { Game } from '$lib/client/Game.svelte.js';
	import GameCard from './GameCard.svelte';

	let { games }: { games: Game[] } = $props();
</script>

<div class="game-list">
	{#each games.toSorted((a, b) => a.start.getTime() - b.start.getTime()) as game (game.id)}
		<GameCard {game} />
	{/each}
</div>

<style>
	.game-list {
		width: 100%;
		display: grid;
		gap: 1rem;
		padding: 0 1rem;
		overflow-y: auto;
	}
</style>
