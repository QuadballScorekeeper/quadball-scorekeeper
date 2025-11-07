<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	let { data } = $props();
	let { players } = data;
</script>

<main>
	<Table>
		<TableHead>
			<TableHeadCell>Number</TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each players as player}
				<TableBodyRow>
					<TableBodyCell>
						{player.number}
					</TableBodyCell>
					<TableBodyCell>
						{player.name}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</main>

<style>
</style>
