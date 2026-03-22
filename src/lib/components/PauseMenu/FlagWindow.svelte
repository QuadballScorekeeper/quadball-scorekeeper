<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { TabSelect } from '$lib/components/TabSelect';
	import { Button } from '../ui/Button';
	import { Input } from '../ui/Input';

	let { game }: { game: Game } = $props();
	const teamOptions = [game.homeTeam.name, game.awayTeam.name];
	let team = $state(undefined);
	let player = $state(undefined);
	const RUNNER_FLOOR = 20 * 60 * 1000;
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
		<div class="flag-form">
			<Input type="number" required placeholder="Number" bind:value={player} />
			<Button onclick={() => game.addCatch(team == teamOptions[0], player)}>Save</Button>
		</div>
	{/if}
</div>

<style>
	.flag-window {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		width: 100%;
		gap: 1rem;
		border-radius: 0.5rem;
	}

	.flag-form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 100%;
		gap: 1rem;
	}
</style>
