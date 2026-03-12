<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		variant = 'primary',
		size = 'normal',
		href = null,
		onclick = null,
		formaction = null,
		type = null,
		children
	}: {
		variant?: 'primary' | 'secondary' | 'destructive';
		size?: 'normal' | 'large';
		href?: string | null;
		onclick?: (() => void) | null;
		formaction?: string | null;
		type?: 'button' | 'submit' | 'reset' | null;
		children: Snippet;
	} = $props();

	const classes = $derived(`${variant} ${size}`);
</script>

{#if href}
	<a {href} {onclick} class={classes}>
		{@render children()}
	</a>
{:else}
	<button {formaction} {onclick} class={classes} {type}>
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

	.large {
		width: 10rem;
	}
</style>
