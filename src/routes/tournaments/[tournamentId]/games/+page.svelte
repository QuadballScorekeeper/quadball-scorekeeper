<script lang="ts">
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let { data } = $props();
	let { games, tournament } = data;
</script>

{#snippet displayScores(g: {
	homeCatch: number;
	homeGoals: number;
	awayCatch: number;
	awayGoals: number;
})}
	{g.homeGoals + 3 * g.homeCatch}{g.homeCatch ? '*' : ''}
	-
	{g.awayGoals + 3 * g.awayCatch}{g.awayCatch ? '*' : ''}
{/snippet}

<main>
	<Listgroup class="w-80" active>
		{#each games as g}
			<ListgroupItem href="/tournaments/{tournament.id}/games/{g.id}">
				<strong class="grow-2 basis-0">
					{g.home}
				</strong>
				<div class="grow basis-0 text-center">
					{#if g.status == 'scheduled'}
						{g.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					{:else if g.status == 'live'}
						<strong>
							{@render displayScores(g)}
						</strong>
					{:else if g.status == 'finished'}
						{@render displayScores(g)}
					{/if}
				</div>
				<strong class=" grow-2 basis-0 text-right">
					{g.away}
				</strong>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>
