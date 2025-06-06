<script lang="ts">
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

	let { score } = $props();

	function scoreGoal() {
		score++;
	}

	function annulGoal() {
		score = Math.max(0, score - 1);
	}
</script>

<div class="counter">
	<button onclick={scoreGoal} aria-label="Decrease the counter">
		<svg aria-hidden="true" viewBox="0 7 24 10">
			<path d={mdiChevronUp} />
		</svg>
	</button>

	<p>{score}</p>

	<button disabled={!score} onclick={annulGoal} aria-label="Increase the counter">
		<svg aria-hidden="true" viewBox="0 7 24 10">
			<path d={mdiChevronDown} />
		</svg>
	</button>
</div>

<style>
	.counter {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	button {
		width: 5rem;
		max-width: 100%;
		border: 0;
		padding: 0;
		margin: 0;
		background-color: transparent;
		cursor: pointer;
	}

	button svg {
		fill: #006684;
	}

	button:disabled svg {
		fill: #aaa;
	}

	p {
		text-align: center;
		font-size: 5rem;
		font-weight: bold;
		margin: 10px;
		min-width: 8rem;
	}
</style>
