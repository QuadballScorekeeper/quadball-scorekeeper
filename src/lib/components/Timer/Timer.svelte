<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { formatGameTime } from '$lib/utils';
	import { CheckCircleOutline, CirclePauseOutline, PlayOutline } from 'flowbite-svelte-icons';
	import TimerBanner from './TimerBanner.svelte';

	let { game, scorekeeper = false }: { game: Game; scorekeeper?: boolean } = $props();
	let gameTime = $derived(formatGameTime(game.gameTime));
	let timeoutTimeLeft = $state(0);
	const minute = 60 * 1000;
	// let flagRunnerBanner = $derived(game.gameTime >= 18 * minute && game.gameTime < 19 * minute);
	// let seekerBanner = $derived(game.gameTime >= 19 * minute && game.gameTime < 20 * minute);

	function onclick() {
		if (!scorekeeper) return;
		switch (game.status) {
			case 'live':
				game.pauseGame();
				break;
			case 'paused':
				game.resumeGame();
				break;
			case 'timeout':
				game.pauseGame();
				break;
			case 'finished':
				break;
			case 'scheduled':
				game.startGame();
				break;
			case 'cancelled':
				game.status = 'live';
				break;
		}
	}

	$effect(() => {
		if (game.status == 'live') {
			const freq = 100;
			const interval = setInterval(() => {
				game.gameTime += freq;
			}, freq);
			return () => {
				clearInterval(interval);
			};
		} else if (game.status == 'timeout') {
			const freq = 100;
			timeoutTimeLeft = minute;
			const interval = setInterval(() => {
				timeoutTimeLeft -= freq;
				if (timeoutTimeLeft <= 0) {
					game.status = 'paused';
				}
			}, freq);
			return () => {
				clearInterval(interval);
			};
		}
	});
</script>

<div class="container" role={scorekeeper ? 'button' : undefined} {onclick}>
	<TimerBanner {game} end={minute * 10} />
	<div class="timer {game.status} ">
		<div class="status">
			{#if game.status == 'finished'}
				<CheckCircleOutline />
				Full-time
			{:else if game.status == 'scheduled'}
				{#if scorekeeper}
					<PlayOutline class="h-8 w-8" />
					Tap to start
				{:else}
					Scheduled to start:
				{/if}
			{:else if game.status == 'paused'}
				<CirclePauseOutline class="h-6 w-6" />
				Paused
			{:else if game.status == 'timeout'}
				<CirclePauseOutline class="h-6 w-6" />
				Timeout
				{formatGameTime(timeoutTimeLeft)}
			{/if}
		</div>
		{#if game.status == 'cancelled'}
			<div>Cancelled</div>
		{:else}
			<div class="text-2xl">
				{gameTime}
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: fit-content;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 0.5rem;

		:first-child {
			border-top-left-radius: 0.5rem;
			border-top-right-radius: 0.5rem;
		}
		:last-child {
			border-bottom-left-radius: 0.5rem;
			border-bottom-right-radius: 0.5rem;
		}
	}

	.timer {
		width: 100%;
		height: 5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1.5rem;
		color: light-dark(var(--color-gray-400), var(--color-gray-400));
		background-color: light-dark(var(--black), var(--color-gray-500));
	}
	.finished {
		color: light-dark(var(--success), var(--black));
		background-color: light-dark(var(--black), var(--success));
	}
	.live {
		color: var(--white);
	}
	.cancelled {
		background-color: light-dark(var(--color-gray-800), var(--color-gray-300));
	}

	.status {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.timeout {
		background-color: light-dark(var(--black), var(--warning));
	}
	.timeout > .status {
		color: light-dark(var(--warning), var(--black));
	}
	.scheduled > .status {
		color: var(--bg-light);
	}
</style>
