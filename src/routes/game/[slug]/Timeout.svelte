<script lang="ts">
	import { TimeOutEvent } from '$lib/GameEvent';
	import { formatTime } from '$lib/utils';
	import { Button, Modal } from 'flowbite-svelte';

	let { team, game } = $props();

	const MINUTE = 1000 * 60;
	let open: boolean = $state(false);
	let running: boolean = $state(false);
	let remainingTime: number = $state(MINUTE);
	let timeoutAvailable: boolean = $derived(remainingTime > 0);

	const startTimeout = () => {
		running = true;
		game.events.push(new TimeOutEvent(game.gameTime, team));
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

{#if timeoutAvailable && !game.running}
	<Button class="w-20" onclick={showDialog}>Timeout</Button>
{/if}

<Modal bind:open>
	<h1>Timeout for {team.name}</h1>
	<p>Time is {formatTime(game.gameTime)}</p>
	<p>Score is {game.teamA.score}-{game.teamB.score}</p>
	<h2>{formatTime(remainingTime)}</h2>
	{#snippet footer()}
		{#if running}
			<Button onclick={endTimeout}>End</Button>
		{:else}
			<Button onclick={startTimeout}>Start</Button>
		{/if}
		<Button onclick={cancelTimeout} color="alternative">Cancel</Button>
	{/snippet}
</Modal>
