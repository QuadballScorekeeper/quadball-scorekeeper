<script lang="ts">
	// `data` comes from the layout’s load function
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { DarkMode, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';

	let {
		data,
		children
	}: {
		data: {
			tournament: {
				id: number;
				name: string;
				start: string;
				end: string;
			};
		};
		children: Snippet;
	} = $props();
	let activeUrl = $derived(page.url.pathname);
</script>

<Navbar class="bg-primary-50 dark:bg-primary-900">
	<NavBrand href="/">
		<h1>Scorekeeper</h1>
	</NavBrand>
	<h1>{data.tournament.name}</h1>
	<NavHamburger />
	<NavUl {activeUrl}>
		<NavLi href="/tournaments">Tournaments</NavLi>
		<NavLi href="/tournaments/{data.tournament.id}/games">Games</NavLi>
		<NavLi href="/tournaments/{data.tournament.id}/teams">Teams</NavLi>
	</NavUl>
	<DarkMode class="dark:text-primary-50 text-primary-900" />
</Navbar>

{@render children?.()}
