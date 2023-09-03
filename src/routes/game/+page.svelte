<script lang="ts">
	import Counter from '$lib/game/Counter.svelte';
	import Timer from '$lib/game/Timer.svelte';
	import { Game } from '$lib/game/game';

	const game = new Game();
</script>

<svelte:head>
	<title>Quadball</title>
	<meta name="description" content="Quadball Score Tracking" />
</svelte:head>

<main>
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
	<!-- <FlagCatch /> -->
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	.flex-row {
		display: flex;
		flex: 1;
		gap: 16px;
	}

	.team-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		padding: 10px;
	}

	.team-name {
		width: 85%;
	}
</style>
