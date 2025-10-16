<script lang="ts">
	import type { Team } from '$lib/models/Team.svelte';
	import { Button } from 'flowbite-svelte';

	let { team }: { team: Team } = $props();
	const RUNNER_FLOOR = 20 * 60 * 1000;
</script>

{#if team.game.gameTime >= RUNNER_FLOOR && !team.game.runnerCaught}
	<Button class="w-20">Catch</Button>
{/if}

<style>
</style>
