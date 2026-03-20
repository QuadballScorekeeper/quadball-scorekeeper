<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { Time } from '$lib/icons';
	import { Button } from '../ui/Button';

	let { game }: { game: Game } = $props();
</script>

{#snippet timeoutButton(home: boolean)}
	<Button
		disabled={home ? !game.homeTeam.timeoutAvailable : !game.awayTeam.timeoutAvailable}
		onclick={() => {
			game.useTimeout(home);
		}}>Timeout</Button
	>
{/snippet}
<div class="timeout-window">
	<div>
		<Time class="timeout-icon" />
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
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 100%;
		gap: 2rem;
		padding: 0 2rem;
	}

	:global(.timeout-icon) {
		height: 3.5rem;
		width: 3.5rem;
	}
</style>
