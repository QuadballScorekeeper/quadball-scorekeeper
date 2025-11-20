<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { TabSelect } from '$lib/components/TabSelect';

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
	<TabSelect tabs={penaltyOptions} bind:activeTab={penalty} />
	<TabSelect tabs={teamOptions} bind:activeTab={team} />
	<form class="flex w-full gap-4" onsubmit={addPenalty}>
		<input type="hidden" required bind:value={penalty} />
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
</div>

<style>
	.penalty-window {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		gap: 1rem;
		border-radius: 0.5rem;
	}

	.number,
	button {
		border-radius: 0.5rem;
		width: 100%;
	}

	form:invalid button {
		background-color: light-dark(var(--gray-100), var(--gray-600));
		color: light-dark(var(--gray-400), var(--gray-500));
	}

	button {
		background-color: var(--color-black);
		color: var(--color-white);
	}
</style>
