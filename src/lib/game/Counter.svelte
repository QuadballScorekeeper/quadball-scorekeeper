<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { mdiChevronUp, mdiChevronDown } from '@mdi/js';

	// import { spring } from 'svelte/motion';
	export let score: Writable<number>;
	const goalPoints = 10;

	function scoreGoal() {
		console.log('scoring goal');
		score.update((n) => n + goalPoints);
	}

	function annulGoal() {
		console.log('annuling goal');
		score.update((n) => n && n - goalPoints);
	}
</script>

<div class="counter">
	<button on:click={scoreGoal} aria-label="Decrease the counter">
		<svg aria-hidden="true" viewBox="0 0 24 24">
			<path d={mdiChevronUp} />
		</svg>
	</button>

	<div class="counter-viewport">
		<div class="counter-digits">
			<strong>{$score}</strong>
		</div>
	</div>

	<button disabled={!$score} on:click={annulGoal} aria-label="Increase the counter">
		<svg aria-hidden="true" viewBox="0 0 24 24">
			<path d={mdiChevronDown} />
		</svg></button
	>
</div>

<style>
	.counter {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.counter button {
		width: 9vh;
		align-items: center;
		justify-content: center;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
	}

	.counter svg {
		position: relative;
		fill: #006684;
	}

	.counter button:disabled svg {
		fill: #aaa;
	}

	.counter-viewport {
		display: flex;
		flex: 1;
		width: 100%;
		font-size: 8vh;
		position: relative;
		flex-basis: auto;
	}

	.counter-digits {
		text-align: center;
		font-size: 8vh;
		width: 100%;
	}
</style>
