<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import type { Team } from '$lib/client/Team.svelte';
	import ReleaseCounter from './ReleaseCounter.svelte';

	let { team, game }: { team: Team; game: Game } = $props();
	let numPenalties = $derived(team.activePenalties.length);
</script>

<div class="release-counters">
	{#if numPenalties > 0}
		{#if numPenalties > 1}
			{#if numPenalties > 2}
				<div class="three" style="--time-left:{team.activePenalties[2].timeLeft}"></div>
			{/if}
			<div class="two" style="--time-left:{team.activePenalties[1].timeLeft}"></div>
		{/if}
		<ReleaseCounter penalty={team.activePenalties[0]} {game} />
		{#each team.activePenalties.slice(1) as penalty (penalty)}
			<div hidden>
				<ReleaseCounter {penalty} {game} />
			</div>
		{/each}
	{/if}
</div>

<style>
	.release-counters {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 1px;
	}

	.two,
	.three {
		--gradient: calc(min(var(--time-left) / 100, 100) / (100) * 100%);
	}
	.two {
		height: 0.4rem;
		border-radius: 0.5rem 0.5rem 0 0;
		margin: 0 0.5rem;
		background: linear-gradient(
			to right,
			light-dark(var(--gray-600), var(--fg-light)) var(--gradient),
			var(--success) var(--gradient),
			var(--success)
		);
		transition-property: background;
	}
	.three {
		height: 0.4rem;
		border-radius: 0.5rem 0.5rem 0 0;
		margin: 0 1rem;
		background: linear-gradient(
			to right,
			light-dark(var(--gray-500), var(--fg-light)) var(--gradient),
			var(--success) var(--gradient),
			var(--success)
		);
	}
</style>
