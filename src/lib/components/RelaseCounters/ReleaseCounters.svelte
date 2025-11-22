<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import ReleaseCounter from './ReleaseCounter.svelte';

	let {
		game,
		home,
		expanded = $bindable(false)
	}: { game: Game; home: boolean; expanded: boolean } = $props();
	let team = home ? game.homeTeam : game.awayTeam;
</script>

<button
	class="release-counters"
	onclick={() => {
		expanded = !expanded;
	}}
>
	{#each team.activePenalties as penalty, i (i)}
		<ReleaseCounter {penalty} {game} {expanded} {i} />
	{/each}
</button>

<style>
	.release-counters {
		display: flex;
		flex-direction: column-reverse;
		align-items: stretch;
		max-height: 6rem;
		gap: 1px;
		overflow: auto;
	}
</style>
