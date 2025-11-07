<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import { Button, Input, Modal } from 'flowbite-svelte';
	import { AngleDownOutline, AngleUpOutline } from 'flowbite-svelte-icons';

	let { game, home, markNumbers }: { game: Game; home: boolean; markNumbers: boolean } = $props();
	const team = home ? game.homeTeam : game.awayTeam;

	let playerNumber: number | undefined = $state();
	let open: boolean = $state(false);

	function openModal() {
		open = true;
	}

	function closeModal() {
		playerNumber = undefined;
		open = false;
	}

	function scoreMarkedGoal() {
		game.addGoal(home, playerNumber);
		closeModal();
	}

	function scoreGoal() {
		game.addGoal(home);
	}

	function annulGoal() {
		game.removeLastGoal(home);
	}
</script>

<div class="flex flex-col items-center">
	<AngleUpOutline
		onclick={markNumbers ? openModal : scoreGoal}
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

<Modal bind:open>
	<form onsubmit={scoreMarkedGoal} method="dialog">
		<Input type="number" placeholder="Player number" bind:value={playerNumber} />

		<Button type="submit">Submit</Button>
		<Button color="alternative" onclick={closeModal}>Cancel</Button>
	</form>
</Modal>
