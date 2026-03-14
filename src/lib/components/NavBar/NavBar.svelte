<script lang="ts">
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { Home } from '$lib/icons';

	let { children, user }: { children?: Snippet; user?: App.Locals['user'] } = $props();
</script>

<header>
	<nav>
		<a href="/"><Home /></a>
		{@render children?.()}

		<div class="auth-section">
			{#if user}
				<form method="post" action="/logout" use:enhance>
					<button type="submit" class="logout-btn">
						<span>{user.email}</span>
						<span class="logout-text">Logout</span>
					</button>
				</form>
			{:else}
				<a href="/login">Login</a>
			{/if}
		</div>
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

	.auth-section {
		margin-left: auto;
	}

	.auth-section form {
		display: contents;
	}

	.logout-btn {
		display: flex;
		gap: 0.5rem;
		font-size: var(--text-s);
	}

	.logout-text {
		color: var(--text-subtle);
	}
</style>
