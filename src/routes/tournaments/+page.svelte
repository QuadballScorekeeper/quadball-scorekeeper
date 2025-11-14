<script lang="ts">
	import { DarkMode, Listgroup, ListgroupItem, Navbar, NavBrand } from 'flowbite-svelte';

	let { data } = $props();
	let { tournaments } = data;
</script>

<Navbar class="bg-primary-50 dark:bg-primary-900">
	<NavBrand href="/">
		<h1>Scorekeeper</h1>
	</NavBrand>
	<h1>Tournaments</h1>
	<DarkMode class="dark:text-primary-50 text-primary-900" />
</Navbar>

<main>
	<Listgroup active>
		{#each tournaments as t (t.id)}
			<ListgroupItem href="/tournaments/{t.id}" class="flex flex-col">
				<p>{t.name}</p>
				<p>{t.start.toLocaleDateString([])} - {t.end.toLocaleDateString([])}</p>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>

<style>
</style>
