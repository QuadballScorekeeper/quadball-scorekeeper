<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
</script>

<main>
	<h1>Start a game</h1>
	<Button class="w-40" href={'/game/new'}>New game</Button>
	<Button class="w-40" color="amber">Game from code</Button>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100%;
	}
</style>
