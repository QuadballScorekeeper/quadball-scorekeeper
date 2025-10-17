<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import { Button } from 'flowbite-svelte';

	let { game, home }: { game: Game; home: boolean } = $props();
	const RUNNER_FLOOR = 20 * 60 * 1000;

	function addCatch() {
		game.addCatch(home, null);
	}
</script>

{#if game.gameTime >= RUNNER_FLOOR && !game.runnerCaught}
	<Button onclick={addCatch} class="w-20">Catch</Button>
{/if}

<style>
</style>
