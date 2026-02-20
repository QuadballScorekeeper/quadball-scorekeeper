<script lang="ts">
	import ThemeToggle from '$lib/components/NavBar/ThemeToggle.svelte';
	import { Checkbox } from '$lib/components/ui/Checkbox';
	import { Radio } from '$lib/components/ui/Radio';

	let {
		open = $bindable(false),
		swapPlacement = $bindable(false),
		markPlayers = $bindable(false)
	} = $props();

	let settingsMenu: HTMLDivElement;
	$effect(() => {
		settingsMenu.style.right = open ? '0' : '-100%';
	});
</script>

<div id="settings-container" bind:this={settingsMenu}>
	<div class="card">
		Top or bottom placement of score/time?
		<div class="placement">
			<Radio name="placement" value={false} bind:selected={swapPlacement} />
			<Radio name="placement" value={true} bind:selected={swapPlacement} />
		</div>
	</div>
	<div class="card">
		<div class="theme">
			What theme?
			<ThemeToggle />
		</div>
	</div>
	<div class="card">
		Should players be marked?
		<Checkbox bind:checked={markPlayers} />
	</div>
</div>

<style>
	#settings-container {
		display: flex;
		position: absolute;
		flex-direction: column;
		background-color: var(--bg-default);
		top: 0;
		right: -100%;
		width: 100%;
		z-index: 1;
		overflow-x: hidden;
		transition: all 300ms ease-out;
		height: 100lvh;
		gap: 1rem;
		padding: 1rem 1.5rem;
	}
	.card {
		background-color: var(--surface-0);
		border-radius: 0.5rem;
		box-shadow: var(--shadow-light);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	.placement {
		display: grid;
		justify-items: center;
		grid-template-columns: 1fr 1fr;
	}

	.theme {
		display: flex;
		justify-content: space-between;
	}
</style>
