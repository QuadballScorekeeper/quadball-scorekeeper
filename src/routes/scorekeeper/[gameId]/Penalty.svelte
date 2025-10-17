<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import type { PenaltyType } from '$lib/models/GameEvent.svelte';
	import { Button, Input, Modal, Radio } from 'flowbite-svelte';

	const penalties: PenaltyType[] = ['blue_card', 'yellow_card', 'red_card', 'ejection'];
	let { game, home }: { game: Game; home: boolean } = $props();
	let penaltyType: PenaltyType = $state(penalties[0]);
	let playerNumber: number | undefined = $state();

	let open: boolean = $state(false);
	const openModal = () => {
		open = true;
	};
	const closeModal = () => {
		penaltyType = penalties[0];
		playerNumber = undefined;
		open = false;
	};
	const submitPenalty = () => {
		game.addPenalty(home, playerNumber!, penaltyType!);
		console.log('push penalty event');
		closeModal();
	};
</script>

<!-- {#if !game.running} -->
{#if true}
	<Button class="w-20" onclick={openModal}>Penalty</Button>
{/if}

<Modal bind:open>
	<form onsubmit={submitPenalty} method="dialog">
		{#each penalties as penalty}
			<Radio value={penalty} bind:group={penaltyType}>{penalty}</Radio>
		{/each}
		<Input type="number" placeholder="Player number" bind:value={playerNumber} required />

		<Button type="submit">Submit</Button>
		<Button color="alternative" onclick={closeModal}>Cancel</Button>
	</form>
</Modal>
