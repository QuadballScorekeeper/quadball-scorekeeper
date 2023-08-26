<script lang="ts">
	import { onDestroy } from 'svelte';
	import { time } from './stores';
	import type { Unsubscriber } from 'svelte/store';
	import { formatTime } from './utils';

	let lapse = 0;
	let previous = 0;
	let unsubscribe: Unsubscriber | undefined;

	function start() {
		if (!unsubscribe) unsubscribe = time.subscribe((value) => (lapse = value + previous));
	}

	function stop() {
		if (unsubscribe) {
			unsubscribe();
			unsubscribe = undefined;
			previous = lapse;
		}
	}

	onDestroy(() => stop());
</script>

<div class="timer">
	<h1>{formatTime(lapse)}</h1>
	<div>
		<button on:click={start} disabled={unsubscribe !== undefined}>Start</button>
		<button on:click={stop} disabled={unsubscribe === undefined}>Stop</button>
	</div>
</div>

<style>
	.timer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
