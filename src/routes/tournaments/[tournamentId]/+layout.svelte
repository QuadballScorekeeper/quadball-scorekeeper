<script lang="ts">
	import { DarkMode, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
	let { data, children } = $props();
	const { tournamentData } = data;
</script>

<Navbar class="bg-primary-50 dark:bg-primary-900">
	<NavBrand href="/">
		<h1>Scorekeeper</h1>
	</NavBrand>
	<NavUl>
		<NavLi><p>{tournamentData.name}</p></NavLi>
	</NavUl>
	<DarkMode class="dark:text-primary-50 text-primary-900" />
</Navbar>

{@render children()}
