<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { TabSelect } from '$lib/components/TabSelect';
	import { Input } from '../ui/Input';
	import { Button } from '../ui/Button';

	let { game }: { game: Game } = $props();
	const penaltyOptions = {
		'🟦': 'blue_card',
		'🟨': 'yellow_card',
		'🟥': 'red_card',
		'🚫': 'ejection'
	};
	let penalty = $state(undefined);
	let penaltyString = $derived(penalty ? penaltyOptions[penalty] : undefined);
	const teamOptions = [game.homeTeam.name, game.awayTeam.name];
	let team = $state(undefined);
	let player = $state(undefined);
</script>

<div class="penalty-window">
	<TabSelect tabs={Object.keys(penaltyOptions)} bind:activeTab={penalty} />
	<TabSelect tabs={teamOptions} bind:activeTab={team} />
	<div class="penalty-form">
		<Input type="number" required placeholder="Number" bind:value={player} />
		<Button onclick={() => game.addPenalty(team == game.homeTeam.name, player!, penaltyString!)}
			>Save</Button
		>
	</div>
</div>

<style>
	.penalty-window {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		gap: 1rem;
		border-radius: 0.5rem;
	}

	.penalty-form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
</style>
