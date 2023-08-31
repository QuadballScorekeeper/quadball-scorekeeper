<script lang="ts">
	import Counter from '$lib/game/Counter.svelte';
	import Timer from '$lib/game/Timer.svelte';
	import FlagCatch from '$lib/game/flag-catch.svelte';
	import { Game } from '$lib/game/game';

	const game = new Game();
</script>

<svelte:head>
	<title>Quadball</title>
	<meta name="description" content="Quadball Score Tracking" />
</svelte:head>

<section>
	<div class="game-section">
		<Timer {...game} />
		<div class="flex-row">
			<div class="team-column">
				<input class="team-name" placeholder="Team A" />
				<Counter score={game.scoreA} />
			</div>
			<div class="team-column">
				<input class="team-name" placeholder="Team B" />
				<Counter score={game.scoreB} />
			</div>
		</div>
	</div>
	<!-- <FlagCatch /> -->
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		min-height: 100vh;
	}

	.game-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 70vh;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		flex: 1;
		align-items: start;
	}

	.team-name {
		display: flex;
		flex: 1;
	}
	.team-column {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		flex: 1;
		align-items: center;
	}
</style>
