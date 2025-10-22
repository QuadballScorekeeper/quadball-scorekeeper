<script lang="ts">
	import { Button, Navbar, NavBrand } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
</script>

<Navbar class="bg-primary-50 dark:bg-primary-900">
	<NavBrand href="/">
		<h1>Scorekeeper</h1>
	</NavBrand>
	<DarkMode class="dark:text-primary-50 text-primary-900" />
</Navbar>

<main>
	<Button class="w-40" href="/scorekeeper">Start a game</Button>
	<Button class="w-40" href="/tournaments" color="secondary">View tournaments</Button>
	<!-- <Button class="w-40" color="blue">Plan tournament</Button> -->
</main>

<style>
	main {
		gap: 1rem;
	}
</style>
