<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import type { Penalty } from '$lib/client/Penalty.svelte';
	import { Success } from '$lib/icons';
	import { formatGameTime } from '$lib/utils';
	import { fade } from 'svelte/transition';

	let { penalty, game, expanded }: { penalty: Penalty; game: Game; expanded: boolean } = $props();

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
	class="penalty {expanded ? '' : 'compact'}"
	style="--gradient:{gradient}%"
	out:fade={{ delay: 500, duration: 500 }}
>
	{#if penalty.timeLeft > 2 * freq}
		{penalty.getIcon()}
		{penalty.player}
		<div>
			{formatGameTime(penalty.timeLeft)}
		</div>
	{:else}
		Release {penalty.player}
		<div>
			<Success />
		</div>
	{/if}
</div>

<style>
	@property --gradient {
		syntax: '<length-percentage>';
		inherits: false;
		initial-value: 100%;
	}
	@property --_bg-clr {
		syntax: '<color>';
		inherits: false;
		initial-value: var(-fg-light);
	}

	.penalty {
		--_bg-clr: light-dark(var(--gray-800), var(--gray-700));
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(
			to right,
			transparent var(--gradient),
			var(--success) var(--gradient),
			var(--success)
		);
		background-color: var(--_bg-clr);
		color: var(--color-white);
		gap: 0.5rem;
		transition:
			all 150ms ease allow-discrete,
			--gradient 100ms linear allow-discrete;

		height: 2rem;
		padding: 0.25rem 1rem;
		border-radius: 0.5rem;

		&.compact:nth-child(n + 2) {
			font-size: 0;
			padding: 0;
			border-radius: 0.5rem 0.5rem 0 0;
			* {
				display: none;
			}
		}

		&:nth-child(2) {
			transition-duration: 200ms;
		}
		&.compact:nth-child(2) {
			--_bg-clr: light-dark(var(--gray-600), var(--gray-800));
			transition-duration: 300ms;
			height: 0.5rem;
			margin: 0 0.5rem;
		}
		&:nth-child(3) {
			transition-duration: 250ms;
		}
		&.compact:nth-child(3) {
			transition-duration: 250ms;
			--_bg-clr: light-dark(var(--gray-500), var(--gray-850));
			height: 0.375rem;
			margin: 0 1rem;
		}
		&:nth-child(n + 4) {
			transition-duration: 300ms;
			&.compact {
				transition-duration: 200ms;
				height: 0;
				margin: 0 1.5rem;
				display: none;
			}
			@starting-style {
				font-size: 0;
				padding: 0;
				border-radius: 0.5rem 0.5rem 0 0;
				height: 0;
				margin: 0 1.5rem;
			}
		}
	}
</style>
