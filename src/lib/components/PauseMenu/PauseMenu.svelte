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
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		background-color: var(--bg-light);
		padding: 0.5rem 1.5rem;
		gap: 0.5rem;
		height: 100%;
		min-height: 12rem;
	}
</style>
