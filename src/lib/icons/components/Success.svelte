<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M9.576 1.265a11 11 0 0 1 6.9.681 1 1 0 0 1-.813 1.828A9 9 0 1 0 21 12v-.92a1 1 0 1 1 2 0V12l-.009.444A11 11 0 1 1 9.576 1.265"
	/><path
		fill="currentColor"
		d="M21.293 3.293a1 1 0 0 1 1.414 1.414l-10 10.01a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L12 12.596z"
	/>
</svg>
