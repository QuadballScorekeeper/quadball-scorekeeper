<script lang="ts">
	import { Button, Navbar, NavBrand } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
</script>

<Navbar class="bg-primary-700 dark:bg-primary-600">
	<NavBrand href="/">
		<h1 class="text-white">Scorekeeper</h1>
	</NavBrand>
	<DarkMode class="dark:text-primary-200 text-primary-900" />
</Navbar>

<main>
	<Button class="w-40" href="/scorekeeper">Start a game</Button>
	<Button class="w-40" href="/tournaments" color="amber">View tournaments</Button>
	<Button class="w-40" color="blue">Plan tournament</Button>
</main>

<style>
	main {
		gap: 1rem;
	}
</style>
