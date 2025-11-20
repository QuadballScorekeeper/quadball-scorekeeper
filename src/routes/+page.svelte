<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
</script>

<NavBar />

<main>
	<a class="button" href="/scorekeeper">Start a game</a>
	<a class="button" href="/tournaments">View tournaments</a>
</main>

<style>
	main {
		gap: 1rem;
	}
	a {
		display: flex;
		width: 10rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		justify-content: center;
		align-items: center;
	}
</style>
