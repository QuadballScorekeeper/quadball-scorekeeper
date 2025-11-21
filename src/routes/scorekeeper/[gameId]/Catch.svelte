<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import { Button, Input, Modal } from 'flowbite-svelte';

	let { game, home, markNumbers }: { game: Game; home: boolean; markNumbers: boolean } = $props();
	const RUNNER_FLOOR = 20 * 60 * 1000;

	let playerNumber: number | undefined = $state();
	let open: boolean = $state(false);

	function openModal() {
		open = true;
	}
	function closeModal() {
		playerNumber = undefined;
		open = false;
	}
	function addMarkedCatch() {
		game.addCatch(home, playerNumber);
		closeModal();
	}

	function addCatch() {
		game.addCatch(home);
	}
</script>

{#if game.gameTime >= RUNNER_FLOOR && !game.runnerCaught}
	<Button onclick={markNumbers ? openModal : addCatch} class="w-20">Catch</Button>
{/if}

<Modal bind:open>
	<form onsubmit={addMarkedCatch} method="dialog">
		<Input type="number" placeholder="Player number" bind:value={playerNumber} />

		<Button type="submit">Submit</Button>
		<Button color="alternative" onclick={closeModal}>Cancel</Button>
	</form>
</Modal>
