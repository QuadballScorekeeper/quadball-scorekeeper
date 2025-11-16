<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import type { Team } from '$lib/client/Team.svelte';
	import ReleaseCounter from './ReleaseCounter.svelte';

	let { team, game }: { team: Team; game: Game } = $props();
</script>

<div>
	{#each team.activePenalties as penalty (penalty)}
		<ReleaseCounter {penalty} {game} />
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: 4px;
	}
</style>
