<script lang="ts">
	import type { Team } from '$lib/models/Team.svelte';
	import { formatGameTime } from '$lib/utils';
	import { Button, Modal } from 'flowbite-svelte';

	let { team }: { team: Team } = $props();

	const MINUTE = 1000 * 60;
	let open: boolean = $state(false);
	let running: boolean = $state(false);
	const time = team.timeoutAvailable ? MINUTE : 0;
	let remainingTime: number = $state(time);

	const startTimeout = () => {
		running = true;
		team.useTimeout();
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

{#if remainingTime && !team.game.running}
	<Button class="w-20" onclick={showDialog}>Timeout</Button>
{/if}

<Modal bind:open>
	<h1>Timeout for {team.name}</h1>
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
