<script lang="ts">
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';
	let {
		data
	}: {
		data: {
			teams: {
				id: number;
				name: string;
			}[];
			tournament: {
				id: number;
			};
		};
	} = $props();
</script>

<main>
	<Listgroup active>
		{#each data.teams as team}
			<ListgroupItem href="/tournaments/{data.tournament.id}/teams/{team.id}">
				<strong>{team.name ?? 'Missing team name'}</strong>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>

<style>
</style>
