<script lang="ts">
	import { Game } from '$lib/Game.svelte';
	import Timer from './Timer.svelte';
	import Counter from './Counter.svelte';
	import Penalty from './Penalty.svelte';
	import Timeout from './Timeout.svelte';
	import { formatTime } from '$lib/utils';

	let gameParams = $props();
	let game = Game.fromParams(gameParams);
</script>

<Timer {game} />
<div class="flex-row">
	<div class="team-column">
		<h1>{game.teamA.name}</h1>
		<Counter team={game.teamA} {game} />
		<Penalty team={game.teamA} {game} />
		<Timeout team={game.teamA} {game} />
	</div>
	<div class="team-column">
		<h1>{game.teamB.name}</h1>
		<Counter team={game.teamB} {game} />
		<Penalty team={game.teamB} {game} />
		<Timeout team={game.teamB} {game} />
	</div>
</div>

<ul>
	{#each game.events as event}
		{#if event.team == game.teamA}
			<li class="text-amber-600">{`${formatTime(event.gameTime)} - ${event.eventInfo()}`}</li>
		{:else}
			<li class="text-green-600">{`${formatTime(event.gameTime)} - ${event.eventInfo()}`}</li>
		{/if}
	{/each}
</ul>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.team-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		width: 10rem;
	}
</style>
