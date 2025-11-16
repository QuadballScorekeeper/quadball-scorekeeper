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
<div>
	<ClockOutline class="h-14 w-14" />
</div>
<div class="button-group">
	{@render timeoutButton(true)}
	{@render timeoutButton(false)}
</div>

<style>
	.button-group {
		display: flex;
		width: 100%;
		gap: 24px;
	}
	button {
		text-align: center;
		text-justify: center;
		background-color: var(--color-black);
		color: var(--color-white);
		border-radius: 8px;
		width: 100%;
		height: 40px;

		&:disabled {
			background-color: var(--color-gray-100);
			color: var(--color-gray-400);
		}
	}
</style>
