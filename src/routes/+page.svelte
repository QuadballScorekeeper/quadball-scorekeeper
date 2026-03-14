<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';
	import { Overlay } from '$lib/components/ui/Overlay';

	let { data } = $props();
	let user = $derived(data.user);
</script>

<NavBar {user} />

<Overlay />

<main>
	<Button href="/tournaments" size="large">View tournaments</Button>
	<Button href="/scorekeeper" size="large">Start a game</Button>

	{#if user?.role === 'admin'}
		<Button href="/admin" size="large">Admin panel</Button>
	{/if}
</main>

<style>
	main {
		gap: 1rem;
	}
</style>
