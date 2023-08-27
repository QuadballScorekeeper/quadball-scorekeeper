<script lang="ts">
	let timeIsStopped = false;
	let examplePrompt = '';

	function start() {
		timeIsStopped = false;
		examplePrompt = '';
	}
	function stop() {
		timeIsStopped = true;
	}
</script>

<div class="timer">
	<h1>Penalty Cards</h1>
	<div>
		<button on:click={start} disabled={!timeIsStopped}>Start time(Hide cards)</button>
		<button on:click={stop} disabled={timeIsStopped}>Stop time(Show cards)</button>
	</div>
</div>

<p hidden={!timeIsStopped}>{examplePrompt}</p>

{#if timeIsStopped}
	<div class="buttons-container" style="bottom: 0;">
		<div class="buttons">
			<button on:click={() => (examplePrompt = 'Blue Card Selected')}>Blue Card</button>
			<button on:click={() => (examplePrompt = 'Yellow Card Selected')}>Yellow Card</button>
			<button on:click={() => (examplePrompt = 'Red Card Selected')}>Red Card</button>
		</div>
	</div>
{/if}

<style>
	.timer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.buttons-container {
		position: fixed;
		bottom: -60px; /* Initial position below the screen */
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		padding: 20px;
		background-color: #f0f0f0;
		transition: bottom 0.3s ease-in-out;
	}

	.buttons {
		display: flex;
		gap: 10px;
	}
</style>
