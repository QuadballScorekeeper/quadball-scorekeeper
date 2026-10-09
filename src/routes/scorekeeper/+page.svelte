<script lang="ts">
	import { goto } from '$app/navigation';
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';
	import GameCard from './GameCard.svelte';

	let { data } = $props();
	let games = $derived(data.games);
</script>

<NavBar />

<main>
	<h1>Select game to scorekeep:</h1>
	{#each games as game (game.id)}
		<GameCard {game} />
	{/each}

	<div class="divider">
		<span>or</span>
	</div>

	<div class="local-game">
		<p>Start a quick game without saving to the database</p>
		<Button onclick={() => goto('/scorekeeper/local')}>Start Local Game</Button>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	h1 {
		font-size: var(--text-xl);
		font-weight: 600;
	}

	p {
		color: var(--text-subtle);
		font-size: var(--text-s);
	}

	.divider {
		display: flex;
		align-items: center;
		margin: 1rem 0;
		max-width: 20rem;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background-color: var(--border-default);
	}

	.divider span {
		padding: 0 1rem;
		color: var(--text-subtle);
		font-size: var(--text-s);
	}

	.local-game {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 20rem;
	}
</style>
