<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import TournamentCard from './TournamentCard.svelte';

	let { data } = $props();
	let { tournaments } = data;
</script>

<NavBar />

<main>
	{#each tournaments as tournament (tournament.start)}
		<TournamentCard {tournament} />
	{/each}
</main>

<style>
	main {
		gap: 0.5rem;
	}
</style>
