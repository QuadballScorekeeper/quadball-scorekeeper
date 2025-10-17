<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Input, Modal } from 'flowbite-svelte';

	let open: boolean = $state(false);
	let gameNumber: number | undefined = $state();

	const openModal = () => {
		open = true;
	};
	const closeModal = () => {
		open = false;
	};
	const gotoGame = () => {
		goto(`scorekeeper/${gameNumber}`);
	};
</script>

<main>
	<h1>Start a game</h1>
	<Button class="w-40" href={'/scorekeeper/new'}>New game</Button>
	<Button class="w-40" onclick={openModal} color="amber">Game from code</Button>
</main>

<Modal bind:open>
	<form onsubmit={gotoGame}>
		<Input type="number" placeholder="Game number" bind:value={gameNumber} required />

		<Button type="submit">Start game</Button>
		<Button color="alternative" onclick={closeModal}>Cancel</Button>
	</form>
</Modal>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100%;
	}
</style>
