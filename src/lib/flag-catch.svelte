<script>
	let flagCaught = false;
	let timeIsStopped = false;
	let isOvertime = false;
	let winningMessage = '';
	let score = {
		A: 30,
		B: 0
	};

	function flagCatch(teamCatching) {
		flagCaught = true;
		score[teamCatching] += 30;
		updateDisplayedMessage();
		checkIsOvertime(teamCatching);
	}

	function updateDisplayedMessage() {
		if (score['A'] > score['B']) return (winningMessage = 'Team A is winning');
		if (score['B'] > score['A']) return (winningMessage = 'Team B is winning');
		if (score['A'] === score['B']) return (winningMessage = 'Its a tie ohshit!');
	}

	function checkIsOvertime(teamCatching) {
		if (teamCatching === 'A' && score['A'] <= score['B']) return (isOvertime = true);
		if (teamCatching === 'B' && score['B'] <= score['A']) return (isOvertime = true);
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
{#if !timeIsStopped}
	<p>Pretent like time is running now.</p>
	<p>Flag catch stuff is not shown.</p>
{/if}

{#if timeIsStopped}
	<div>
		<button on:click={() => flagCatch('A')} disabled={flagCaught || isOvertime}>Catch Team A</button
		>
		<button on:click={() => flagCatch('B')} disabled={flagCaught || isOvertime}>Catch Team B</button
		>
	</div>
	<p>{winningMessage}</p>
	{#if flagCaught}
		{#if isOvertime}
			<p>Is overtime!</p>
		{:else}
			<p>Game is over!</p>
		{/if}
	{/if}
{/if}
