<script>
	import Counter from '$lib/Counter.svelte';
	import PenaltyCards from '$lib/PenaltyCards.svelte';
	import Timer from '$lib/Timer.svelte';
</script>

<svelte:head>
	<title>Quadball</title>
	<meta name="description" content="Quadball Score Tracking" />
</svelte:head>

<section>
	<Timer />
	<Counter />
	<Counter />
	<PenaltyCards />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
