<script lang="ts">
	import { page } from '$app/state';
	import { DarkMode, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';

	let { params, children } = $props();
	let activeUrl = $derived(page.url.pathname);
</script>

<Navbar class="bg-primary-50 dark:bg-primary-900">
	<NavBrand href="/admin">
		<h1>Scorekeeper Admin</h1>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl}>
		<NavLi href="/admin/{params.tournamentId}">Admin</NavLi>
		<NavLi href="/admin/{params.tournamentId}/games">Games</NavLi>
		<NavLi href="/admin/{params.tournamentId}/teams">Teams</NavLi>
	</NavUl>
	<DarkMode class="dark:text-primary-50 text-primary-900" />
</Navbar>

{@render children?.()}
