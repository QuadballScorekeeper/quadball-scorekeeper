<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { Tournament } from '$lib/client/Tournament.svelte.js';
	import Teams from './Teams.svelte';
	import Games from './Games.svelte';

	let { data } = $props();
	const tournament = new Tournament(data.tournamentData);
	let value = $state('games');
</script>

<NavBar>
	{tournament.name}
	<button onclick={() => (value = 'games')}> Games </button>
	<button onclick={() => (value = 'teams')}> Teams </button>
</NavBar>

<main>
	{#if value == 'teams'}
		<Teams teams={tournament.teams} />
	{:else if value == 'games'}
		<Games games={tournament.games} />
	{/if}
</main>

<style>
	button {
		background-color: transparent;
	}
</style>
