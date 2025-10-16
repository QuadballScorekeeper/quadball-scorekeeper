<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import { formatGameTime } from '$lib/utils';
	import { PauseSolid, PlaySolid } from 'flowbite-svelte-icons';

	let { game }: { game: Game } = $props();

	$effect(() => {
		if (game.running) {
			const freq = 100;
			const interval = setInterval(() => {
				game.gameTime += freq;
			}, freq);
			return () => {
				clearInterval(interval);
			};
		}
	});
</script>

<div class="timer">
	<strong class="font-mono text-5xl">{formatGameTime(game.gameTime)}</strong>
	<div>
		{#if game.running}
			<PauseSolid
				onclick={() => {
					game.pauseGame();
				}}
				class="h-14 w-14 cursor-pointer dark:text-gray-200"
			/>
		{:else}
			<PlaySolid
				onclick={() => {
					game.resumeGame();
				}}
				class="h-14 w-14 cursor-pointer dark:text-gray-200"
			/>
		{/if}
	</div>
</div>

<style>
	.timer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.timer > div {
		height: 100%;
		display: flex;
		align-content: center;
	}
</style>
