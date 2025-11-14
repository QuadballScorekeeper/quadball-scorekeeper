<script lang="ts">
	import { Team } from '$lib/client/Team.svelte.js';
	import { Accordion, AccordionItem, Listgroup, ListgroupItem } from 'flowbite-svelte';
	let { teams }: { teams: Team[] } = $props();
</script>

<Accordion class="dark:bg-primary-900 w-100">
	{#each teams as team (team.id)}
		<AccordionItem>
			{#snippet header()}
				{team.name}
			{/snippet}
			<Listgroup>
				{#each team.players as player (player.number)}
					<ListgroupItem>
						#{player.number} - {player.name}
					</ListgroupItem>
				{/each}
			</Listgroup>
		</AccordionItem>
	{/each}
</Accordion>
