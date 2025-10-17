<script lang="ts">
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let { data } = $props();
	let { games, tournament } = data;
</script>

<main>
	<Listgroup class="w-80" active>
		{#each games as g}
			<ListgroupItem href="/tournaments/{tournament.id}/games/{g.game.id}">
				<strong class="grow-2 basis-0">
					{g.homeTeam.name}
				</strong>
				<div class="grow basis-0 text-center">
					{#if g.game.status == 'scheduled'}
						{g.game.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					{:else if g.game.status == 'live'}
						Live
					{:else if g.game.status == 'finished'}
						Done
					{/if}
				</div>
				<strong class=" grow-2 basis-0 text-right">
					{g.awayTeam.name}
				</strong>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>
