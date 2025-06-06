<script lang="ts">
	import { fade } from 'svelte/transition';

	let { game } = $props();

	let dialog: HTMLDialogElement;
	const showDialog = () => {
		dialog.showModal();
	};
	const closeDialog = () => {
		dialog.close();
	};
</script>

{#if !game.running}
	<button transition:fade={{ duration: 100 }} onclick={showDialog}>Penalty</button>
{/if}

<dialog bind:this={dialog}>
	<h1>Penalty</h1>
	<input type="number" placeholder="Player number" />
	<div class="flex-row">
		<button>Blue</button>
		<button>Yellow</button>
		<button>Red</button>
		<button>Ejection</button>
	</div>
	<button onclick={closeDialog}>Close</button>
</dialog>

<style>
	button {
		width: 4rem;
		border: none;
		border-radius: 5px;
		padding: 6px 8px;
		display: table-cell;
		text-align: center;
		color: white;
		background-color: #006684;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	button:hover {
		background-color: #117795;
	}

	button:active {
		background-color: aqua;
	}
</style>
