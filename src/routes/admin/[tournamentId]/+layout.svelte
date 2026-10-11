<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { page } from '$app/state';

	let { params, children } = $props();

	const base = $derived(`/admin/${params.tournamentId}`);
	const links = $derived([
		{ href: base, label: 'Admin' },
		{ href: `${base}/games`, label: 'Games' },
		{ href: `${base}/teams`, label: 'Teams' }
	]);

	const isActive = (href: string) =>
		href === base ? page.url.pathname === base : page.url.pathname.startsWith(href);
</script>

<NavBar>
	{#each links as link (link.href)}
		<a href={link.href} class:active={isActive(link.href)}>{link.label}</a>
	{/each}
</NavBar>

{@render children?.()}

<style>
	a.active {
		background-color: light-dark(var(--gray-150), var(--gray-700));
	}
</style>
