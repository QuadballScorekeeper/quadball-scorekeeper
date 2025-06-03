<script lang="ts">
	import { goto } from '$app/navigation';

	const newGame = () => {
		goto('/game/new');
	};
</script>

<main>
	<h1>Start a game</h1>
	<button style:background-color="#006684" onclick={newGame}>New game</button>
	<button style:background-color="#FB8500">Game from code</button>
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

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100%;
	}
</style>
