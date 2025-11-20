<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { formatGameTime } from '$lib/utils';

	let { game, end }: { game: Game; end: number } = $props();
	let remainingTime = $derived(end - game.gameTime);
</script>

<div class="banner text-xs">
	<div class="message">Lorem Ipsum</div>
	{formatGameTime(remainingTime)}
</div>

<style>
	.banner {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--warning);
		padding: 0.125rem 0.5rem;
		gap: 1rem;
		color: var(--color-gray-700);
		border-radius: 0.5rem 0.5rem 0 0;
		width: 100%;
	}
	.message {
		display: flex;
	}
</style>
