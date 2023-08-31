<script lang="ts">
	import { formatTime } from '$lib/common/utils';
	import { onDestroy } from 'svelte';
	import { get, type Unsubscriber, type Writable } from 'svelte/store';
	import { time } from './stores';

	export let duration: Writable<number>;
	export let started: Writable<boolean>;
	export let paused: Writable<boolean>;

	let previousDuration = 0;
	let unsubscribe: Unsubscriber | undefined;

	function start() {
		if (get(started)) {
			//throw error
		}

		console.log('starting game');
		unsubscribe = time.subscribe((value) => duration.set(value));
		started.set(true);
	}

	function pause() {
		if (!unsubscribe) {
			console.log('could not pause game as it is already paused');
			return;
		}

		console.log('pausing game');
		previousDuration = get(duration);
		unsubscribe();
		unsubscribe = undefined;
		paused.set(true);
	}

	function resume() {
		if (get(started)) {
			//throw error
		}

		console.log('resuming game');
		unsubscribe = time.subscribe((value) => duration.set(value + previousDuration));
		paused.set(false);
	}

	onDestroy(() => unsubscribe?.call({}));
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
