<script>
	import { formatTime } from './utils';

	let flagCaught = false;
	let timeIsStopped = false;

	let isOvertime = false;
	let gameIsOver = false;
	let winningTeam = '';

	let score = {
		A: 30,
		B: 10
	};

	function flagCatch(teamCatching) {
		flagCaught = true;
		score[teamCatching] += 30;
		checkIsOvertime(teamCatching);
		setGameWinner();
	}

	function setGameWinner() {
		if (isOvertime) return;
		if (score['A'] > score['B']) return (winningTeam = 'A');
		if (score['B'] > score['A']) return (winningTeam = 'B');
	}

	function checkIsOvertime(teamCatching) {
		if (teamCatching === 'A' && score['A'] <= score['B']) return (isOvertime = true);
		if (teamCatching === 'B' && score['B'] <= score['A']) return (isOvertime = true);
		gameIsOver = true;
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
		<button on:click={() => flagCatch('A')} disabled={flagCaught}>Catch Team A</button>
		<button on:click={() => flagCatch('B')} disabled={flagCaught}>Catch Team B</button>
	</div>
{/if}

{#if isOvertime}
	<p>Overtime</p>
{/if}
{#if gameIsOver}
	<p>Game is over</p>
	<p>Winner is: {winningTeam}</p>
{/if}


<style>
	.timer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
