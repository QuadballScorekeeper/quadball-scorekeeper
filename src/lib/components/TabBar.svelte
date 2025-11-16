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
		padding: 4px;
		border-radius: 8px;
		background-color: var(--color-white);
	}

	.tab-item {
		padding: 4px 8px;
		border-radius: 4px;
		width: 100%;
		cursor: pointer;
	}

	.tab-item.active {
		background-color: var(--color-gray-200);
	}
</style>
