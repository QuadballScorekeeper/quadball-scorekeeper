<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Home } from '$lib/icons';

	let { children }: { children?: Snippet } = $props();
</script>

<header>
	<nav>
		<a href="/"><Home /></a>
		{@render children?.()}
		<!-- <ThemeToggle /> -->
	</nav>
</header>

<style>
	header {
		display: flex;
		width: 100%;
		height: 3rem;
		background-color: light-dark(var(--white), var(--black));
		box-shadow: 0 0.25rem 0.625rem 0 hsla(0, 0%, 0%, 0.08);
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1.5rem;
		gap: 1rem;
		width: clamp(20rem, 100%, 35rem);
		margin-inline: auto;
	}

	nav :global(a),
	nav :global(button) {
		display: flex;
		align-items: center;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		color: var(--text-default);
		transition: background-color 0.2s ease;

		&:hover {
			background-color: light-dark(var(--gray-150), var(--gray-700));
		}

		&:active {
			background-color: light-dark(var(--gray-200), var(--gray-600));
		}
	}
</style>
