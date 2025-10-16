<script lang="ts">
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let {
		data
	}: {
		data: {
			players: {
				name: string;
				number: number;
			}[];
		};
	} = $props();
</script>

<main>
	<Listgroup>
		{#each data.players as player}
			<ListgroupItem>
				{player.number}: {player.name}
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>

<style>
</style>
