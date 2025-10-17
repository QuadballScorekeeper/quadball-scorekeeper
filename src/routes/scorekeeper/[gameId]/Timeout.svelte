<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import { formatGameTime } from '$lib/utils';
	import { Button, Modal } from 'flowbite-svelte';

	let { game, home }: { game: Game; home: boolean } = $props();
	const team = home ? game.homeTeam : game.awayTeam;

	const MINUTE = 1000 * 60;
	let open: boolean = $state(false);
	let running: boolean = $state(false);
	const time = team.timeoutAvailable ? MINUTE : 0;
	let remainingTime: number = $state(time);

	const startTimeout = () => {
		running = true;
		game.useTimeout(home);
	};

	const showDialog = () => {
		open = true;
	};

	const cancelTimeout = () => {
		running = false;
		open = false;
		remainingTime = MINUTE;
	};

	const endTimeout = () => {
		running = false;
		open = false;
		remainingTime = 0;
	};

	$effect(() => {
		if (running) {
			const freq = 1000;
			const interval = setInterval(() => {
				remainingTime -= freq;
				if (remainingTime <= 0) {
					running = false;
					// Create a popup if dialog is not open saying that the timer is done
				}
			}, freq);
			return () => {
				clearInterval(interval);
			};
		}
	});
</script>

{#if remainingTime && !game.running}
	<Button class="w-20" onclick={showDialog}>Timeout</Button>
{/if}

<Modal bind:open>
	<h1>Timeout for {team.name}</h1>
	<!-- <h1>Time is {game.gameTime}</h1>
	<h1>Score is {game.homeTeam.score}-{game.awayTeam.score}</h1> -->
	<h2>{formatGameTime(remainingTime)}</h2>
	{#snippet footer()}
		{#if running}
			<Button onclick={endTimeout}>End</Button>
		{:else}
			<Button onclick={startTimeout}>Start</Button>
		{/if}
		<Button onclick={cancelTimeout} color="alternative">Cancel</Button>
	{/snippet}
</Modal>
