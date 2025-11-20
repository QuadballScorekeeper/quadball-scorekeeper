<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import type { Penalty } from '$lib/client/Penalty.svelte';
	import { formatGameTime } from '$lib/utils';
	import { CheckCircleOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';

	let { penalty, game }: { penalty: Penalty; game: Game } = $props();

	let gradient = $derived(Math.floor(Math.min(penalty.timeLeft / 100, 100)));
	const freq = 100;
	$effect(() => {
		if (game.status == 'live') {
			const interval = setInterval(() => {
				penalty.removeTime(freq);
				console.log(penalty.timeLeft);
			}, freq);
			return () => {
				clearInterval(interval);
			};
		}
	});
</script>

<div class="penalty" style="--gradient:{gradient}%" out:fade={{ delay: 500, duration: 500 }}>
	{#if penalty.timeLeft > 2 * freq}
		{penalty.getIcon()}
		{penalty.player}
		<div>
			{formatGameTime(penalty.timeLeft)}
		</div>
	{:else}
		Release {penalty.player}
		<div>
			<CheckCircleOutline />
		</div>
	{/if}
</div>

<style>
	.penalty {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(
			to right,
			var(--color-gray-800) var(--gradient),
			var(--color-success-dark) var(--gradient),
			var(--color-success-dark)
		);
		transition-property: background;
		color: var(--color-white);
		width: 100%;
		padding: 0.25rem 1rem;
		border-radius: 0.25rem;
		gap: 0.5rem;
	}
</style>
