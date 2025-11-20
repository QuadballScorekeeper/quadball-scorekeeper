<script lang="ts">
	let { tabs, activeTab = $bindable() }: { tabs: string[]; activeTab: string | undefined } =
		$props();

	function setActiveTab(value: string) {
		activeTab = value;
	}
</script>

<div class="tab">
	{#each tabs as value (value)}
		<button class="tab-item" onclick={() => setActiveTab(value)} class:active={value == activeTab}>
			{value}
		</button>
	{/each}
</div>

<style>
	.tab {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 0.5rem;
		padding: 0.25rem;
		gap: 0.25rem;
		background-color: var(--bg-dark);
	}

	.tab-item {
		background-color: transparent;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		width: 100%;
		cursor: pointer;
	}

	.tab-item.active {
		background-color: var(--bg-light);
		box-shadow: 0 0.25rem 1rem 0 hsla(0, 0%, 0%, 0.12);
	}
</style>
