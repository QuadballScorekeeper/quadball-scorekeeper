<script>
	let { children } = $props();
</script>

<div class="overlay-wrapper">
	{@render children()}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto&display=swap');

	.overlay-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: transparent;
		font-family: var(--font-default);
		color: var(--text-default);
	}
</style>
