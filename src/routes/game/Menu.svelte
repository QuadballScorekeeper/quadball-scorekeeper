<script lang="ts">
	import { BurgerSolid, CloseOutline } from 'flowbite-svelte-icons';
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';

	let open = false;

	const toggleMenu = () => {
		open = !open;
	};
</script>

<nav>
	<button aria-label="burger menu" onclick={toggleMenu}>
		{#if open}
			<CloseOutline />
		{:else}
			<BurgerSolid />
		{/if}
	</button>
</nav>

{#if open}
	<button
		transition:fade={{ easing: cubicOut }}
		onclick={toggleMenu}
		class="background"
		aria-label="clickable-background"
	></button>
	<div transition:slide={{ axis: 'x', easing: cubicOut }} class="menu">
		<p>Menu options</p>
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
		</ul>
	</div>
{/if}

<style>
	button {
		position: relative;
		z-index: 2;
		width: 3rem;
		background-color: transparent;
		border: 0;
		font-weight: bold;
		cursor: pointer;
	}

	.menu {
		z-index: 1;
		position: fixed;
		top: 0;
		right: 0;
		width: 50%;
		height: 100%;
		background-color: #006684;
		transition: 0.3s ease;
	}
	/* Media query for mobile devices */
	@media (max-width: 768px) {
		.menu {
			width: 100%; /* Full width for mobile devices */
		}
	}

	.background {
		z-index: 0;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #006684;
		backdrop-filter: blur(5px);
		opacity: 0.8;
	}
</style>
