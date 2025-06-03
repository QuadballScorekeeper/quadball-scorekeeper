<script lang="ts">
	import { goto } from '$app/navigation';
	import { mdiMenu } from '@mdi/js';
</script>

<header>
	<h1>Scorekeeper</h1>
	<nav>
		<button class="burger-menu" aria-label="burger menu">
			<svg aria-hidden="true" viewBox="0 0 24 24">
				<path d={mdiMenu} />
			</svg>
		</button>
	</nav>
</header>

<main>
	<h1>Welcome to Quadball Scorekeeper</h1>

	<button
		style:background-color="#006684"
		onclick={() => {
			goto('/game');
		}}>Start a game</button
	>
	<button style:background-color="#FB8500">View tournaments</button>
	<button style:background-color="#219EBC">Plan tournament</button>
</main>

<style>
	button {
		width: 12rem;
		height: 3rem;
		font-size: 1rem;
		border: 0;
		border-radius: 5px;
		color: white;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		min-height: 2rem;
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
	.burger-menu {
		width: 3rem;
		background-color: transparent;
		border: 0;
		font-weight: bold;
	}
</style>
