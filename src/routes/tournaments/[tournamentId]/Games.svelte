<script lang="ts">
	import { page } from '$app/state';
	import { Game } from '$lib/client/Game.svelte.js';
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let { games }: { games: Game[] } = $props();
</script>

{#snippet displayScores(g: Game)}
	{g.homeTeam.score}{g.homeTeam.catch ? '*' : ''}
	-
	{g.awayTeam.score}{g.awayTeam.catch ? '*' : ''}
{/snippet}

<main>
	<Listgroup class="w-80" active>
		{#each games as game (game.id)}
			<ListgroupItem href="{page.url}/game/{game.id.toString()}">
				<strong class="grow-2 basis-0">
					{game.homeTeam.name}
				</strong>
				<div class="grow basis-0 text-center">
					{#if game.status == 'scheduled'}
						{game.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					{:else if game.status == 'live'}
						<strong>
							{@render displayScores(game)}
						</strong>
					{:else if game.status == 'finished'}
						{@render displayScores(game)}
					{/if}
				</div>
				<strong class=" grow-2 basis-0 text-right">
					{game.awayTeam.name}
				</strong>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>
