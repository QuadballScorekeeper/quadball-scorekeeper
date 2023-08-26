<script>
	let gameIsOver = false;
	let timeIsStopped = true;
	let isOvertime = false;
	let winningMessage = '';
	let score = {
		A: 100,
		B: 10
	};

	function flagCatch(teamCatching) {
		score[teamCatching] += 30;
		updateDisplayedMessage();
		checkGameIsOver(teamCatching);
	}

	function updateDisplayedMessage() {
		if (score['A'] > score['B']) return (winningMessage = 'Team A is winning');
		if (score['B'] > score['A']) return (winningMessage = 'Team B is winning');
		if (score['A'] === score['B']) return (winningMessage = 'Its a tie ohshit!');
	}

	function checkGameIsOver(teamCatching) {
		if (teamCatching === 'A' && score['A'] > score['B']) return (gameIsOver = true);
		if (teamCatching === 'B' && score['B'] > score['A']) return (gameIsOver = true);
		isOvertime = true;
	}

	function toggleFeature() {
		timeIsStopped = !timeIsStopped;
	}
</script>

<button on:click={toggleFeature}>
	{#if timeIsStopped}
		Start timer
	{:else}
		Stop timer
	{/if}
</button>

<p>{score['A']}-{score['B']}</p>
{#if timeIsStopped}
	<div>
		<button on:click={() => flagCatch('A')} disabled={gameIsOver || isOvertime}>Flag Catch team A</button>
		<button on:click={() => flagCatch('B')} disabled={gameIsOver || isOvertime}>Flag Catch team B</button>
	</div>
{/if}
<p>{winningMessage}</p>
{#if gameIsOver}
	<p>Game is over!</p>
{/if}
{#if isOvertime}
	<p>Is overtime!</p>
{/if}
