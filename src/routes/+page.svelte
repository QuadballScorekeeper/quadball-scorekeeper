<script>
	import { mdiMenu } from '@mdi/js';
</script>

<svelte:head>
	<title>Roarball</title>
	<meta name="description" content="Quadball Score Tracking" />
</svelte:head>

<div class="layout">
	<header>
		<h1 class="title">Roarball.no</h1>
		<nav class="burger-menu-container">
			<svg class="burger-menu" viewBox="0 0 24 24"><path d={mdiMenu} /></svg>
		</nav>
	</header>
	<main>
		<h2>Welcome to Roarball 🥳</h2>
		<nav class="main-menu">
			<a class="button" href="/game" style="background-color: #006684;">Start a game</a>
			<button class="button" style="background-color: #FB8500;">View tournaments</button>
			<button class="button" style="background-color: #219EBC;">Plan tournament</button>
		</nav>
	</main>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	header {
		display: flex;
		justify-content: space-between;
		min-height: 76px;
		height: 10%;
		background-color: #006684;
		color: #ffffff;
	}

	.title {
		margin: auto 0 auto 5%;
	}

	.burger-menu-container {
		margin: auto 2.5% auto 0;
	}

	.burger-menu {
		width: 48px;
		height: 48px;
		fill: white;
	}

	main {
		height: 100%;
		max-width: 1024px;

		margin: 5% auto 0 auto;

		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: start;
	}

	.main-menu {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.button {
		border: 0px;
		border-radius: 5px;

		padding: 0.5em;

		color: white;
		text-align: center;
		font-size: large;
		font-weight: bold;
		text-decoration: none;
	}
</style>
