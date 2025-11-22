<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import type { Penalty } from '$lib/client/Penalty.svelte';
	import { formatGameTime } from '$lib/utils';
	import { CheckCircleOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';

	let {
		penalty,
		game,
		expanded,
		i
	}: { penalty: Penalty; game: Game; expanded: boolean; i: number } = $props();

	const childNum = $derived(expanded ? 0 : i);
	let gradient = $derived(Math.floor(Math.min(penalty.timeLeft / 100, 100)));
	const freq = 100;
	$effect(() => {
		if (game.status == 'live') {
			const interval = setInterval(() => {
				penalty.removeTime(freq);
			}, freq);
			return () => {
				clearInterval(interval);
			};
		}
	});
</script>

<div
	class="penalty n-{childNum}"
	style="--gradient:{gradient}%"
	out:fade={{ delay: 500, duration: 500 }}
>
	{#if childNum == 0}
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
	{/if}
</div>

<style>
	@property --gradient {
		syntax: '<length-percentage>';
		inherits: false;
		initial-value: 100%;
	}
	@property --base-clr {
		syntax: '<color>';
		inherits: false;
		initial-value: var(-fg-light);
	}

	.penalty {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(
			to right,
			transparent var(--gradient),
			var(--success) var(--gradient),
			var(--success)
		);
		background-color: var(--base-clr);
		color: var(--color-white);
		border-radius: 0.5rem 0.5rem 0 0;
		gap: 0.5rem;
		transition:
			all 300ms ease,
			--gradient 100ms linear;

		&.n-0 {
			--base-clr: var(--fg-light);
			height: 2rem;
			padding: 0.25rem 1rem;
			border-radius: 0.5rem;
		}

		&.n-1 {
			--base-clr: light-dark(var(--gray-600), var(--fg-light));
			height: 0.5rem;
			margin: 0 0.5rem;
			border-radius: 0.5rem 0.5rem 0 0;
			font-size: 0;
			padding: 0;
		}

		&.n-2 {
			--base-clr: light-dark(var(--gray-500), var(--fg-light));
			height: 0.375rem;
			margin: 0 1rem;
			border-radius: 0.5rem 0.5rem 0 0;
			font-size: 0;
			padding: 0;
		}
	}
</style>
