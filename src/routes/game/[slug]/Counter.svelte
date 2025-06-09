<script lang="ts">
	import { GoalEvent } from '$lib/GameEvent';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

	let { team, game } = $props();

	function scoreGoal() {
		team.score++;
		game.events.push(new GoalEvent(game.gameTime, team));
	}

	function annulGoal() {
		team.score = Math.max(0, team.score - 1);
		// remove last goal by this team
	}
</script>

<div class="counter">
	<AngleUpOutline
		onclick={scoreGoal}
		class="text-primary-700 dark:text-primary-600 h-14 w-14 cursor-pointer"
	/>

	<strong class="font-mono text-5xl">{team.score}</strong>

	<AngleDownOutline
		onclick={annulGoal}
		class="text-primary-700 dark:text-primary-600 h-14 w-14 cursor-pointer"
	/>
</div>

<style>
	.counter {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
