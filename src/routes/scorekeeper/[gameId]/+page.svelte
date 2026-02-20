<script lang="ts">
	import { Game } from '$lib/client/Game.svelte';
	import { TeamScore } from '$lib/components/TeamScore';
	import { PauseMenu } from '$lib/components/PauseMenu';
	import { ReleaseCounters } from '$lib/components/RelaseCounters';
	import { Timer } from '$lib/components/Timer';
	import { NavBar } from '$lib/components/NavBar';
	import GameSettings from './GameSettings.svelte';
	import { Button } from '$lib/components/ui/Button';

	let { data } = $props();
	let game = new Game(data.gameData);
	let expanded = $state(false);

	let swapPlacement = $state(false);
	let markPlayers = $state(false);
	let settingsOpen = $state(false);
	// Wait for data to load to actually create stuff on the page!
	// Now it jumps from 0 goals and stuff to correct info, ugly!
</script>

<NavBar>
	<Button
		onclick={() => {
			settingsOpen = !settingsOpen;
		}}
	>
		Menu
	</Button>
</NavBar>
<main>
	<GameSettings open={settingsOpen} {swapPlacement} {markPlayers} />
	<div class="top">
		<div class="teams">
			<ReleaseCounters {game} home={true} bind:expanded />
			<ReleaseCounters {game} home={false} bind:expanded />
		</div>
		<Timer {game} scorekeeper={true} />
		<div class="teams">
			<TeamScore {game} home={true} scorekeeper={true} />
			<TeamScore {game} home={false} scorekeeper={true} />
		</div>
	</div>
	<PauseMenu {game} />
</main>

<style>
	main {
		overflow-x: hidden;
		padding: 0;
		display: grid;
		grid-template-rows: 20rem minmax(20rem, 1fr);
		align-items: stretch;
	}
	.teams {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.5rem;
	}
	.top {
		display: grid;
		flex-direction: column;
		grid-template-rows: 1fr auto auto;
		padding: 0 1.5rem 3rem;
		gap: 1rem;
	}
</style>
