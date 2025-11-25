<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { TabSelect } from '$lib/components/TabSelect';
	import { Input } from '../ui/Input';

	let { game }: { game: Game } = $props();
	const penaltyOptions = ['blue_card', 'yellow_card', 'red_card', 'ejection'];
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
	<form onsubmit={addPenalty}>
		<input type="hidden" required bind:value={penalty} />
		<input type="hidden" required bind:value={team} />
		<Input type="number" required placeholder="Number" bind:value={player} />
		<button class="button" type="submit">Save</button>
	</form>
</div>

<style>
	.penalty-window {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		gap: 1rem;
		border-radius: 0.5rem;
	}

	form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
</style>
