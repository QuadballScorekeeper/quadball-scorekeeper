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
	<FlagCatch />
	<Timer {...game} />
	<Counter score={game.scoreA} />
	<Counter score={game.scoreB} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
