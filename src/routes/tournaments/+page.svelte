<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';

	let { data } = $props();
	let { tournaments } = data;
</script>

<NavBar />

<main>
	{#each tournaments as t (t.id)}
		<a class="button" href="/tournaments/{t.id}">
			<p>{t.name}</p>
			<p>{t.start.toLocaleDateString([])} - {t.end.toLocaleDateString([])}</p>
		</a>
	{/each}
</main>

<style>
	a {
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
	}
	main {
		gap: 0.5rem;
	}
</style>
