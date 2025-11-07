<script lang="ts">
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let { data } = $props();
	let { games } = data;
</script>

<main class="gap-4">
	<h1>Select game to scorekeep:</h1>
	<Listgroup class="w-80" active>
		{#each games as game}
			<ListgroupItem href="/scorekeeper/{game.id}">
				<strong class="grow-2 basis-0">
					{game.homeTeam.name}
				</strong>
				<div class="grow basis-0 text-center">
					{game.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				</div>
				<strong class=" grow-2 basis-0 text-right">
					{game.awayTeam.name}
				</strong>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>
