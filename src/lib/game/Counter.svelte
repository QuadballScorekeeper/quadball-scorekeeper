<script lang="ts">
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
	import type { Writable } from 'svelte/store';

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

	<div class="counter-digits">
		<strong>{$score}</strong>
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
		width: 100px;
		max-width: 100%;
		border: 0;
		background-color: transparent;
	}

	.counter svg {
		fill: #006684;
	}

	.counter button:disabled svg {
		fill: #aaa;
	}

	.counter-digits {
		text-align: center;
		font-size: 4.5rem;
	}
</style>
