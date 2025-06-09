<script lang="ts">
	import { DarkMode, Navbar, NavBrand } from 'flowbite-svelte';

	let { children } = $props();
</script>

<Navbar class="bg-primary-700 dark:bg-primary-600">
	<NavBrand href="/">
		<h1 class="text-white">Scorekeeper</h1>
	</NavBrand>
	<DarkMode class="dark:text-primary-200 text-primary-900" />
</Navbar>

<main>
	{@render children()}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100%;
	}
</style>
