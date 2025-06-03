<script lang="ts">
	import { Game } from '$lib/Game.svelte';
	import Timer from './Timer.svelte';
	import Counter from './Counter.svelte';
	import Penalty from './Penalty.svelte';
	import Timeout from './Timeout.svelte';

	let { data } = $props();
	console.log(data);
	let game = new Game(data.teamA, data.teamB);
</script>

<Timer {game} />
<div class="flex-row">
	<div class="team-column">
		<p>{game.teamA}</p>
		<Counter score={game.scoreA} />
		<Penalty {game} />
		<Timeout team={game.teamA} {game} />
	</div>
	<div class="team-column">
		<p>{game.teamB}</p>
		<Counter score={game.scoreB} />
		<Penalty {game} />
		<Timeout team={game.teamB} {game} />
	</div>
</div>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.team-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
		gap: 5px;
	}
</style>
