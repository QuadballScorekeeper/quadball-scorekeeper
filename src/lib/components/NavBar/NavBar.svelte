<script lang="ts">
	import type { Snippet } from 'svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { Home } from '$lib/icons';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="banner">
	<nav>
		<a href="/"><Home /></a>
		{@render children?.()}
		<ThemeToggle />
	</nav>
</div>

<style>
	.banner {
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
</style>
