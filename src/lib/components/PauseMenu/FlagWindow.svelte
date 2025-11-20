<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { TabSelect } from '$lib/components/TabSelect';

	let { game }: { game: Game } = $props();
	const teamOptions = [game.homeTeam.name, game.awayTeam.name];
	let team = $state(undefined);
	let player = $state(undefined);
	// const RUNNER_FLOOR = 20 * 60 * 1000;
	const RUNNER_FLOOR = 0;

	function addCatch(event: Event) {
		event.preventDefault();
		game.addCatch(team == teamOptions[0], player!);
	}
</script>

<div class="flag-window">
	{#if game.gameTime < RUNNER_FLOOR}
		<strong>Too early</strong>
		<p>Can't catch the flag before 20 minutes into the match</p>
	{:else if game.runnerCaught}
		<strong>The flag has already been caught</strong>
		<p>Add an option to remove the catch here?</p>
	{:else}
		<TabSelect tabs={teamOptions} bind:activeTab={team} />
		<form class="flex w-full gap-4" onsubmit={addCatch}>
			<input type="hidden" required bind:value={team} />
			<input
				class="number"
				type="text"
				inputmode="numeric"
				pattern="[0-9]+"
				required
				placeholder="Number"
				bind:value={player}
			/>
			<button type="submit">Save</button>
		</form>
	{/if}
</div>

<style>
	.flag-window {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		width: 100%;
		gap: 1rem;
		border-radius: 0.5rem;
	}

	.number,
	button {
		border-radius: 0.5rem;
		width: 100%;
	}

	button {
		background-color: var(--fg-dark);
		color: var(--bg-light);
	}
</style>
