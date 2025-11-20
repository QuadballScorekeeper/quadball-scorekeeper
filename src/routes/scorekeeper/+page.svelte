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
					<strong class="grow-2 basis-0">
						{game.homeTeam.name}
					</strong>
					<div class="grow basis-0 text-center">
						{game.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
					<strong class=" grow-2 basis-0 text-right">
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
</style>
