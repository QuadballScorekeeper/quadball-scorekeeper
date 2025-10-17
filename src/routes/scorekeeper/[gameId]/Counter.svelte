<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

	let { game, home }: { game: Game; home: boolean } = $props();
	const team = home ? game.homeTeam : game.awayTeam;

	function scoreGoal() {
		game.addGoal(home, null);
	}

	function annulGoal() {
		game.removeLastGoal(home);
	}
</script>

<div class="counter">
	<AngleUpOutline
		onclick={scoreGoal}
		class="text-primary-700 dark:text-primary-500 h-14 w-14 cursor-pointer"
	/>

	<div class="flex items-start">
		<strong class="font-mono text-5xl">{team.score}</strong>
		<strong class="w-0 font-mono text-2xl">{team.catch ? '*' : ''}</strong>
	</div>

	<AngleDownOutline
		onclick={annulGoal}
		class="text-primary-700 dark:text-primary-500 h-14 w-14 cursor-pointer"
	/>
</div>

<style>
	.counter {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
