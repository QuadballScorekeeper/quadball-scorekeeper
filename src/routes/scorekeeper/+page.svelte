<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';

	let { data } = $props();
	let { games } = data;
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
						{game.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
					<strong class="away-team">
						{game.awayTeam.name}
					</strong>
				</a>
			</li>
		{/each}
	</ul>
</main>

<style>
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
</style>
