<script lang="ts">
	import { Button, Navbar, NavBrand } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { DarkMode } from 'flowbite-svelte';
</script>

<Navbar class="bg-primary-700 dark:bg-primary-600">
	<NavBrand>
		<h1 class="text-white">Scorekeeper</h1>
	</NavBrand>
	<DarkMode class="dark:text-primary-200 text-primary-900" />
</Navbar>

<main>
	<h1 class="dark:text-gray-200">Welcome to Quadball Scorekeeper</h1>

	<Button
		class="w-40"
		onclick={() => {
			goto('/game');
		}}>Start a game</Button
	>
	<Button class="w-40" color="amber">View tournaments</Button>
	<Button class="w-40" color="blue">Plan tournament</Button>
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
