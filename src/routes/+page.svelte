<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';
</script>

<NavBar />

<main>
	<Button href="/scorekeeper" size="large">Start a game</Button>
	<Button href="/tournaments" size="large">View tournaments</Button>
</main>

<style>
	main {
		gap: 1rem;
	}
</style>
