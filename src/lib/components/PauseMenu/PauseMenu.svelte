<script lang="ts">
	import { EventWindow } from '$lib/components/EventWindow';
	import { TabSelect } from '$lib/components/TabSelect';
	import FlagWindow from './FlagWindow.svelte';
	import PenaltyWindow from './PenaltyWindow.svelte';
	import TimeoutWindow from './TimeoutWindow.svelte';

	let { game } = $props();

	const tabs = ['Events', 'Penalty', 'Timeout', 'Flag'];
	let activeTab: string = $state(tabs[0]);
</script>

<div class="pause-menu">
	<TabSelect {tabs} bind:activeTab />
	{#if activeTab == 'Events'}
		<EventWindow {game} />
	{:else if activeTab == 'Penalty'}
		<PenaltyWindow {game} />
	{:else if activeTab == 'Timeout'}
		<TimeoutWindow {game} />
	{:else if activeTab == 'Flag'}
		<FlagWindow {game} />
	{/if}
</div>

<style>
	.pause-menu {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		background-color: var(--surface-0);
		padding: 1rem 1rem;
		gap: 1rem;
	}
</style>
