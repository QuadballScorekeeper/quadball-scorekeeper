<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { formatGameTime } from '$lib/utils';
	import { CheckCircleOutline, CirclePauseOutline, PlayOutline } from 'flowbite-svelte-icons';

	let { game, scorekeeper = false }: { game: Game; scorekeeper?: boolean } = $props();
	let gameTime = $derived(formatGameTime(game.gameTime));
	let timeoutTimeLeft = $state(0);
	let statuses: Game['status'][] = [
		'live',
		'finished',
		'scheduled',
		'cancelled',
		'timeout',
		'paused'
	];

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
			timeoutTimeLeft = 60 * 1000;
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

<div class="{game.status} timer" role={scorekeeper ? 'button' : undefined} {onclick}>
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

{#if false}
	{#each statuses as status (status)}
		<label>
			<input type="radio" value={status} bind:group={game.status} />
			{status}
		</label>
	{/each}
{/if}

<style>
	.timer {
		width: 100%;
		height: 128px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 8px;
		padding: 8px 24px 8px 24px;
		gap: 10px;
		color: var(--color-gray-400);
		background-color: var(--color-black);
	}
	.finished {
		color: var(--color-success-light);
	}
	.live {
		color: var(--color-white);
	}
	.cancelled {
		background-color: var(--color-gray-800);
	}

	.status {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.timeout > .status {
		color: var(--color-warning-light);
	}
	.scheduled > .status {
		color: var(--color-white);
	}
</style>
