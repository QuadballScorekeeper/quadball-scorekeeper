<script lang="ts">
	import { PenaltyEvent, PenaltyTypes } from '$lib/GameEvent';
	import { Button, Input, Modal, Radio } from 'flowbite-svelte';

	let { team, game } = $props();
	let penaltyType: PenaltyTypes = $state(PenaltyTypes.BLUE);
	let playerNumber: number | undefined = $state();

	let open: boolean = $state(false);
	const openModal = () => {
		open = true;
	};
	const closeModal = () => {
		penaltyType = PenaltyTypes.BLUE;
		playerNumber = undefined;
		open = false;
	};
	const submitPenalty = () => {
		game.events.push(new PenaltyEvent(game.gameTime, team, playerNumber!.toString(), penaltyType));
		closeModal();
	};
</script>

{#if !game.running}
	<Button class="w-20" onclick={openModal}>Penalty</Button>
{/if}

<Modal bind:open>
	<form onsubmit={submitPenalty} method="dialog">
		<Radio value={PenaltyTypes.BLUE} bind:group={penaltyType}>Blue</Radio>
		<Radio value={PenaltyTypes.YELLOW} bind:group={penaltyType}>Yellow</Radio>
		<Radio value={PenaltyTypes.RED} bind:group={penaltyType}>Red</Radio>
		<Radio value={PenaltyTypes.EJECTION} bind:group={penaltyType}>Ejection</Radio>
		<Input type="number" placeholder="Player number" bind:value={playerNumber} required />

		<Button type="submit">Submit</Button>
		<Button color="alternative" onclick={closeModal}>Cancel</Button>
	</form>
</Modal>
