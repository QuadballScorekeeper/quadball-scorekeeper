<script lang="ts">
	import { goto } from '$app/navigation';
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';

	let { data } = $props();
	let games = $derived(data.games);
</script>

<NavBar />

<main>
	<h1>Select game to scorekeep:</h1>
	<ul>
		{#each games as game (game.id)}
			<li>
				<a href="/scorekeeper/{game.id}">
					<strong class="home-team">
						{game.homeTeam.name}
					</strong>
					<div class="game-time">
						{game.scheduledStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
					<strong class="away-team">
						{game.awayTeam.name}
					</strong>
				</a>
			</li>
		{/each}
	</ul>

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

	ul {
		display: grid;
		gap: 0.5rem;
	}

	li {
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;

		a {
			display: flex;
			gap: 0.25rem;
		}
	}

	.home-team {
		flex-grow: 2;
		flex-basis: 0;
	}

	.game-time {
		flex-grow: 1;
		flex-basis: 0;
		text-align: center;
	}

	.away-team {
		flex-grow: 2;
		flex-basis: 0;
		text-align: right;
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
