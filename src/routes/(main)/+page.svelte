<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';
</script>

<NavBar />

<main>
	<Button href="/tournaments" size="large">View tournaments</Button>
	<Button href="/scorekeeper" size="large">Start a game</Button>
	<Button href="/admin" size="large">Admin panel</Button>
</main>

<style>
	main {
		gap: 1rem;
	}
</style>
