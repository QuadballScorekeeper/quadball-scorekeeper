<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let user = $derived(data.user);
</script>

<NavBar>
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
</NavBar>

<main>
	<Button href="/tournaments" size="large">View tournaments</Button>
	<Button href="/scorekeeper" size="large">Start a game</Button>

	{#if user?.role === 'admin'}
		<Button href="/admin" size="large">Admin panel</Button>
	{/if}
</main>

<style>
	main {
		gap: 1rem;
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
