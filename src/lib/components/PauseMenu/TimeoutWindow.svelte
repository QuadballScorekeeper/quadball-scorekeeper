<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { ClockOutline } from 'flowbite-svelte-icons';

	let { game }: { game: Game } = $props();
</script>

{#snippet timeoutButton(home: boolean)}
	<button
		disabled={home ? !game.homeTeam.timeoutAvailable : !game.awayTeam.timeoutAvailable}
		onclick={() => {
			game.useTimeout(home);
		}}>Timeout</button
	>
{/snippet}
<div class="timeout-window">
	<div>
		<ClockOutline class="h-14 w-14" />
	</div>
	<div class="button-group">
		{@render timeoutButton(true)}
		{@render timeoutButton(false)}
	</div>
</div>

<style>
	.timeout-window {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}
	.button-group {
		display: flex;
		width: 100%;
		gap: 1.5rem;
	}
	button {
		text-align: center;
		text-justify: center;
		background-color: var(--fg-dark);
		color: var(--bg-dark);
		border-radius: 0.5rem;
		width: 100%;
		height: 2.5rem;

		&:disabled {
			background-color: light-dark(var(--gray-100), var(--gray-600));
			color: light-dark(var(--gray-400), var(--gray-500));
		}
	}
</style>
