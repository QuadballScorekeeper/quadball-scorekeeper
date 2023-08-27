<script lang="ts">
	import { formatTime } from '$lib/common/utils';
	import { onDestroy } from 'svelte';
	import type { Game } from './game';

	export let game: Game;
	const duration = game.duration;
	const started = game.started;
	const paused = game.paused;

	function start() {
		game.start();
	}

	function pause() {
		game.pause();
	}

	function resume() {
		game.resume();
	}

	onDestroy(() => game.pause());
</script>

<div class="timer">
	<h1>{formatTime($duration)}</h1>
	<div>
		<button on:click={start} hidden={$started}>Start</button>
		<button on:click={pause} hidden={$paused || !$started}>Pause</button>
		<button on:click={resume} hidden={!$paused}>Resume</button>
	</div>
</div>

<style>
	.timer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
