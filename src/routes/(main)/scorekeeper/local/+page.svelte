<script lang="ts">
	import { goto } from '$app/navigation';
	import { createLocalGameData, LocalGame } from '$lib/client/LocalGame.svelte';
	import { Button } from '$lib/components/ui/Button';
	import { Input } from '$lib/components/ui/Input';

	let homeTeamName = $state('');
	let awayTeamName = $state('');
	let error = $state('');

	function handleSubmit() {
		// Validation
		if (!homeTeamName.trim()) {
			error = 'Home team name is required';
			return;
		}
		if (!awayTeamName.trim()) {
			error = 'Away team name is required';
			return;
		}

		// Clear any previous error
		error = '';

		// Create game data
		const gameData = createLocalGameData(homeTeamName.trim(), awayTeamName.trim());

		// Save to localStorage using LocalGame's method
		try {
			LocalGame.saveGameData(gameData);

			// Navigate to active game
			goto('/scorekeeper/local/active');
		} catch (err) {
			error = 'Failed to create game. Please try again.';
			console.error(err);
		}
	}
</script>

<div class="container">
	<h1>Start Local Game</h1>
	<p class="description">Enter team names to start a quick game without saving to the database.</p>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<div class="form-group">
			<label for="home-team">Home Team Name</label>
			<Input type="text" bind:value={homeTeamName} placeholder="Enter home team name" />
		</div>

		<div class="form-group">
			<label for="away-team">Away Team Name</label>
			<Input type="text" bind:value={awayTeamName} placeholder="Enter away team name" />
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<Button type="submit">Start Game</Button>
	</form>
</div>

<style>
	.container {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin-bottom: 0.5rem;
		color: light-dark(var(--gray-900), var(--gray-100));
	}

	.description {
		margin-bottom: 2rem;
		color: light-dark(var(--gray-600), var(--gray-400));
		font-size: var(--text-sm);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 500;
		color: light-dark(var(--gray-700), var(--gray-300));
		font-size: var(--text-sm);
	}

	.error {
		padding: 0.75rem;
		background-color: light-dark(var(--red-50), var(--red-900));
		color: light-dark(var(--red-700), var(--red-100));
		border-radius: 0.375rem;
		font-size: var(--text-sm);
	}
</style>
