<script lang="ts">
	import { formatTime } from '$lib/utils';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { team, game } = $props();

	let timeoutAvailable: boolean = $state(true);
	let dialogOpen: boolean = $state(false);
	let running: boolean = $state(false);
	let remainingTime: number = $state(1000 * 60);

	let dialog: HTMLDialogElement;

	const useTimeout = () => {
		timeoutAvailable = false;
		running = true;
	};

	const showDialog = () => {
		dialog.showModal();
	};

	const cancelTimeout = () => {
		timeoutAvailable = true;
		running = false;
		remainingTime = 1000 * 60;
		dialog.close();
	};

	const endTimeout = () => {
		running = false;
		remainingTime = 0;
		dialog.close();
	};

	$effect(() => {
		if (running) {
			const freq = 100;
			const interval = setInterval(() => {
				remainingTime -= freq;
			}, 100);
			return () => {
				clearInterval(interval);
			};
		}
	});
</script>

{#if timeoutAvailable && !game.running}
	<button transition:fade={{ duration: 100 }} onclick={showDialog}>Timeout</button>
{/if}

<dialog bind:this={dialog} open={dialogOpen}>
	<h1>Timeout for {team}?</h1>
	<p>Time is {formatTime(game.gameTime)}</p>
	<p>Score is {game.scoreA}-{game.scoreB}</p>
	<h2>{formatTime(remainingTime)}</h2>

	<button onclick={cancelTimeout}>Cancel</button>
	{#if !running}
		<button onclick={useTimeout}>Start</button>
	{:else}
		<button onclick={endTimeout}>End</button>
	{/if}
</dialog>

<style>
	button {
		width: 4rem;
		border: none;
		border-radius: 5px;
		padding: 6px 8px;
		display: table-cell;
		text-align: center;
		color: white;
		background-color: #006684;
	}
	button:hover {
		background-color: #117795;
	}

	button:active {
		background-color: aqua;
	}
</style>
