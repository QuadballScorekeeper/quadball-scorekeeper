<script lang="ts">
	import { Game } from '$lib/client/Game.svelte';
	import { TeamScore } from '$lib/components/TeamScore';
	import { PauseMenu } from '$lib/components/PauseMenu';
	import { ReleaseCounters } from '$lib/components/RelaseCounters';
	import { Timer } from '$lib/components/Timer';
	import { NavBar } from '$lib/components/NavBar';
	import GameSettings from './GameSettings.svelte';
	import Menu from '$lib/icons/components/Menu.svelte';
	import Close from '$lib/icons/components/Close.svelte';

	let { data } = $props();
	let game = new Game(data.gameData);
	let expanded = $state(false);

	let swapPlacement = $state(false);
	let markPlayers = $state(false);
	let settingsOpen = $state(false);
</script>

<NavBar>
	<button
		onclick={() => {
			settingsOpen = !settingsOpen;
		}}
	>
		{#if settingsOpen}
			<Close />
		{:else}
			<Menu />
		{/if}
	</button>
</NavBar>
<main>
	{#if game.loaded}
		{#if swapPlacement}
			<PauseMenu {game} />
		{/if}
		<GameSettings bind:open={settingsOpen} bind:swapPlacement bind:markPlayers />
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
		{#if !swapPlacement}
			<PauseMenu {game} />
		{/if}
	{:else}
		<div class="loading">Loading game...</div>
	{/if}
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
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 1.5rem;
		color: var(--text-default);
	}
</style>
