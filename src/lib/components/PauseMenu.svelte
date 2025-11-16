<script lang="ts">
	import EventWindow from './EventWindow.svelte';
	import PenaltyWindow from './PenaltyWindow.svelte';
	import TabBar from './TabBar.svelte';
	import TimeoutWindow from './TimeoutWindow.svelte';

	let { game } = $props();

	const tabs = ['Events', 'Penalty', 'Timeout', 'Flag'];
	let activeTab: string = $state(tabs[0]);
</script>

<div class="pause-menu">
	<TabBar {tabs} bind:activeTab />
	{#if activeTab == 'Events'}
		<EventWindow {game} />
	{:else if activeTab == 'Penalty'}
		<PenaltyWindow {game} />
	{:else if activeTab == 'Timeout'}
		<TimeoutWindow {game} />
	{/if}
</div>

<style>
	.pause-menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		background-color: var(--color-purple-200);
		padding: 8px;
		border-radius: 8px;
		gap: 8px;
		height: 100%;
		min-height: 200px;
	}
</style>
