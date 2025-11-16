<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import TabBar from './TabBar.svelte';

	let { game }: { game: Game } = $props();
	const penaltyOptions = ['blue_card', 'yellow_card', 'red_card', 'eject'];
	let penalty = $state(undefined);
	const teamOptions = [game.homeTeam.name, game.awayTeam.name];
	let team = $state(undefined);
	let player = $state(undefined);

	function addPenalty(event: Event) {
		event.preventDefault();
		game.addPenalty(team == teamOptions[0], player!, penalty!);
		penalty = undefined;
		player = undefined;
		team = undefined;
	}
</script>

<div class="penalty-window">
	<TabBar tabs={penaltyOptions} bind:activeTab={penalty} />
	<TabBar tabs={teamOptions} bind:activeTab={team} />
	<form class="flex w-full gap-4" onsubmit={addPenalty}>
		<input type="hidden" required bind:value={penalty} />
		<input type="hidden" required bind:value={team} />
		<input class="number" type="number" required placeholder="Number" bind:value={player} />
		<button type="submit">Save</button>
	</form>
</div>

<style>
	.penalty-window {
		display: flex;
		flex-direction: column;
		background-color: var(--color-purple-300);
		align-items: center;
		justify-content: center;
		padding: 16px;
		width: 100%;
		gap: 16px;
		border-radius: 8px;
	}

	.number,
	button {
		border-radius: 8px;
		width: 100%;
	}

	form:invalid button {
		background-color: var(--color-gray-100);
		color: var(--color-gray-400);
	}

	button {
		background-color: var(--color-black);
		color: var(--color-white);
	}
</style>
