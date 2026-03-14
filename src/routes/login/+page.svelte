<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';
	import { Input } from '$lib/components/ui/Input';

	let { data, form }: { data: any; form: ActionData } = $props();
	let user = $derived(data.user);

	let loading = $state(false);
</script>

<NavBar {user} />

<main>
	<h1>Login</h1>

	<form method="post" action="?/signInEmail" use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	}}>
		<Input
			type="email"
			name="email"
			placeholder="Email"
			required
		/>

		<Input
			type="password"
			name="password"
			placeholder="Password"
			required
		/>

		{#if form?.message}
			<p class="error">{form.message}</p>
		{/if}

		<Button type="submit" disabled={loading}>
			{loading ? 'Logging in...' : 'Log in'}
		</Button>
	</form>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 20rem;
	}

	.error {
		color: var(--error);
		font-size: var(--text-s);
	}

	h1 {
		font-size: var(--text-xl);
		font-weight: 600;
	}
</style>
