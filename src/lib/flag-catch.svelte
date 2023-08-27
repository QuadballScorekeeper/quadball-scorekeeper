<script lang="ts">
	import { formatTime, isOvertime } from './utils';

	let timeIsStopped = false;
	let flagCaught = false;
	let overtime = false;

	let scoreA = 30;
	let scoreB = 10;

	function flagCatchA() {
		scoreA += 30;
		flagCaught = true;
		overtime = isOvertime(scoreA, scoreB);
	}

	function flagCatchB() {
		scoreB += 30;
		flagCaught = true;
		overtime = isOvertime(scoreA, scoreB);
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

<p>{scoreA}-{scoreB}</p>
<div>
	<button on:click={() => flagCatchA} hidden={!timeIsStopped} disabled={flagCaught}
		>Catch Team A</button
	>
	<button on:click={() => flagCatchB} hidden={!timeIsStopped} disabled={flagCaught}
		>Catch Team B</button
	>
</div>

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
