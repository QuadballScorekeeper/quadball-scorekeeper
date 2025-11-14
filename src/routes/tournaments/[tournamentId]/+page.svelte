<script lang="ts">
	import { Tournament } from '$lib/client/Tournament.svelte.js';
	import { Navbar, NavLi, NavUl } from 'flowbite-svelte';
	import Teams from './Teams.svelte';
	import Games from './Games.svelte';

	let { data } = $props();
	const tournament = new Tournament(data.tournamentData);
	let value = $state('games');
</script>

<Navbar class="bg-primary-50 dark:bg-primary-900 items-center">
	<NavUl>
		<NavLi onclick={() => (value = 'teams')}>Teams</NavLi>
		<NavLi onclick={() => (value = 'games')}>Games</NavLi>
	</NavUl>
</Navbar>

<main>
	{#if value == 'teams'}
		<Teams teams={tournament.teams} />
	{:else if value == 'games'}
		<Games games={tournament.games} />
	{/if}
</main>
