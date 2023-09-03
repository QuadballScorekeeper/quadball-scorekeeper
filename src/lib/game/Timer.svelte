<script lang="ts">
	import { formatTime } from '$lib/common/utils';
	import { mdiPause, mdiPlayOutline } from '@mdi/js';
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
		<button on:click={start} hidden={$started}>
			<svg viewBox="0 0 24 24">
				<path d={mdiPlayOutline} />
			</svg>
		</button>
		<button on:click={pause} hidden={$paused || !$started}>
			<svg aria-hidden="true" viewBox="0 0 24 24">
				<path d={mdiPause} />
			</svg>
		</button>
		<button on:click={resume} hidden={!$paused}>
			<svg viewBox="0 0 24 24">
				<path d={mdiPlayOutline} />
			</svg>
		</button>
	</div>
</div>

<style>
	.timer {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 3.5rem;
		padding: 0 10px 0 10px;
	}

	.timer > div {
		height: 100%;
		display: flex;
		align-content: center;
	}

	.timer button {
		width: 100px;
		max-width: 100%;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
	}
</style>
