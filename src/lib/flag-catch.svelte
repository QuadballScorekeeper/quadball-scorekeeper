<script>
	import { formatTime, isOvertime } from './utils';

	let timeIsStopped = false;
	let flagCaught = false;
	let overtime = false;

	let score = {
		A: 30,
		B: 10
	};

	function flagCatchA() {
		score['A'] += 30;
		flagCaught = true;
		overtime = isOvertime(score, 'A', 'B');
	}

	function flagCatchB() {
		flagCaught = true;
		score['A'] += 30;
		overtime = isOvertime(score, 'A', 'B');
	}

	function start() {
		timeIsStopped = false;
	}
	function stop() {
		timeIsStopped = true;
	}
</script>

<div class="timer">
	<h1>{formatTime(0)}</h1>
	<div>
		<button on:click={start} disabled={!timeIsStopped}>Start</button>
		<button on:click={stop} disabled={timeIsStopped}>Stop</button>
	</div>
</div>

<p>{score['A']}-{score['B']}</p>
{#if timeIsStopped}
	<div>
		<button on:click={() => flagCatchA} disabled={flagCaught}>Catch Team A</button>
		<button on:click={() => flagCatchB} disabled={flagCaught}>Catch Team B</button>
	</div>
{/if}

{#if flagCaught}
	<p hidden={!overtime}>Overtime</p>
	<p hidden={overtime}>Game is over</p>
{/if}

<style>
	.timer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
