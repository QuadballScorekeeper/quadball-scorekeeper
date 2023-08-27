<script>
	import { formatTime, checkIsOvertime } from './utils';

	let timeIsStopped = false;
	let flagCaught = false;
	let isOvertime = false;

	let score = {
		A: 30,
		B: 10
	};

	function flagCatchA() {
		score['A'] += 30;
		flagCaught = true;
		isOvertime = checkIsOvertime(score, 'A', 'B');
	}

	function flagCatchB() {
		flagCaught = true;
		score['A'] += 30;
		isOvertime = checkIsOvertime(score, 'A', 'B');
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

{#if flagCaught && isOvertime}
	<p>Overtime</p>
{/if}
{#if flagCaught && !isOvertime}
	<p>Game is over</p>
{/if}

<style>
	.timer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
