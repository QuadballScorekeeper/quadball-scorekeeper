<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';

	let { data } = $props();
	let { tournaments } = data;
</script>

<NavBar />

<main>
	{#each tournaments as t (t.id)}
		<Button href="/tournaments/{t.id}">
			<p>{t.name}</p>
			<p>{t.start.toLocaleDateString([])} - {t.end.toLocaleDateString([])}</p>
		</Button>
	{/each}
</main>

<style>
	a {
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
		color: var(--text-on-reverse);
	}
	main {
		gap: 0.5rem;
	}
</style>
