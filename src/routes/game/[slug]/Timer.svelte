<script lang="ts">
	import { formatTime } from '$lib/utils';
	import { mdiPause, mdiPlay, mdiPlayOutline } from '@mdi/js';
	import { fade } from 'svelte/transition';

	let { game } = $props();

	function start() {
		game.toggleRunning();
	}

	$effect(() => {
		if (game.running) {
			const freq = 100;
			const interval = setInterval(() => {
				game.gameTime += freq;
			}, 100);
			return () => {
				clearInterval(interval);
			};
		}
	});
</script>

<div class="timer">
	<h1>{formatTime(game.gameTime)}</h1>
	<div>
		<button onclick={start} aria-label="play/pause button">
			<svg viewBox="0 0 24 24">
				{#if game.running}
					<path transition:fade={{ duration: 100 }} d={mdiPause} />
				{:else}
					<path transition:fade={{ duration: 100 }} d={mdiPlayOutline} />
				{/if}
			</svg>
		</button>
	</div>
</div>

<style>
	.timer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 3rem;
	}

	.timer > div {
		height: 100%;
		display: flex;
		align-content: center;
	}

	.timer button {
		width: 8rem;
		max-width: 100%;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
	}
</style>
