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
		padding: 0.25rem;
		border-radius: 0.5rem;
		background-color: var(--bg-dark);
	}

	.tab-item {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		width: 100%;
		cursor: pointer;
	}

	.tab-item.active {
		background-color: light-dark(var(--color-gray-300), var(--color-gray-700));
	}
</style>
