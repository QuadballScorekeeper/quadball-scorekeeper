<script lang="ts">
	import { goto } from '$app/navigation';
	import { NavBar } from '$lib/components/NavBar';
	import { Button } from '$lib/components/ui/Button';

	let { data } = $props();
	let user = $derived(data.user);

	let code = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const res = await fetch(`/api/games/code/${code.toUpperCase()}`);

			if (res.ok) {
				const { gameId } = await res.json();
				goto(`/scorekeeper/${gameId}`);
			} else {
				error = 'Invalid code';
			}
		} catch (err) {
			error = 'An error occurred';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		// Auto-capitalize and limit to 6 characters
		code = target.value.toUpperCase().slice(0, 6);
	}
</script>

<NavBar {user} />

<main>
	<h1>Enter Game Code</h1>
	<p>Get the 6-digit code from your tournament admin</p>

	<form onsubmit={handleSubmit}>
		<input
			type="text"
			value={code}
			oninput={handleInput}
			placeholder="Enter code"
			required
			pattern="[A-Z0-9]&#123;6&#125;"
			maxlength="6"
			autocomplete="off"
		/>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<Button type="submit" disabled={loading || code.length !== 6}>
			{loading ? 'Checking...' : 'Start Scorekeeping'}
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

	h1 {
		font-size: var(--text-xl);
		font-weight: 600;
	}

	p {
		color: var(--text-subtle);
		font-size: var(--text-s);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 20rem;
	}

	input {
		padding: 0.75rem 1rem;
		border: 1px solid var(--border-default);
		border-radius: 0.375rem;
		font-size: 1.25rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.25rem;
		text-align: center;
		background-color: var(--surface-0);
		color: var(--text-default);
	}

	input:focus {
		outline: 2px solid var(--blue-500);
		outline-offset: 2px;
	}

	.error {
		color: var(--error);
		font-size: var(--text-s);
	}
</style>
