<script lang="ts">
	import type { SelectGame, SelectTeam } from '$lib/server/db/schema';

	let {
		game
	}: {
		game: Pick<SelectGame, 'id' | 'scheduledStart'> & {
			homeTeam: Pick<SelectTeam, 'name'>;
			awayTeam: Pick<SelectTeam, 'name'>;
		};
	} = $props();
</script>

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

<style>
	a {
		padding: 0.5rem;
		border-radius: 0.5rem;
		background-color: var(--surface-0);
		max-width: 32rem;
		width: 100%;
		display: flex;
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
