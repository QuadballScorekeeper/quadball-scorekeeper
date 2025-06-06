<script lang="ts">
	import { mdiChevronLeft, mdiMenu } from '@mdi/js';
	import { goto } from '$app/navigation';
	import Menu from './Menu.svelte';

	const goBack = () => {
		goto('/');
	};
	let { children } = $props();
</script>

<header>
	<button onclick={goBack} aria-label="Go to previous page">
		<svg aria-hidden="true" viewBox="0 0 24 24">
			<path d={mdiChevronLeft} />
		</svg>
	</button>
	<Menu />
</header>

<main>
	{@render children()}
</main>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 3rem;
		box-sizing: border-box;
		padding: 1rem;

		background-color: #006684;
		color: white;
		fill: white;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100%;
	}

	button {
		width: 3rem;
		background-color: transparent;
		border: 0;
		font-weight: bold;
		cursor: pointer;
	}
</style>
