<script lang="ts">
	let { type = 'primary', href = null, onclick = null, children } = $props();
</script>

{#if href}
	<a {href} {onclick} class={type}>
		{@render children()}
	</a>
{:else}
	<button {onclick} class={type}>
		{@render children()}
	</button>
{/if}

<style>
	a,
	button {
		padding: 0.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.primary {
		background-color: var(--base-default);
		color: var(--text-on-reverse);
	}
	.secondary {
		background-color: var(--surface-0);
		color: var(--text-default);
	}
	.destructive {
		background-color: var(--red-500);
		color: var(--text-on-color);
	}
</style>
