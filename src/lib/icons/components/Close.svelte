<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M17.293 5.293a1 1 0 1 1 1.414 1.414l-12 12a1 1 0 1 1-1.414-1.414z"
	/><path
		fill="currentColor"
		d="M5.293 5.293a1 1 0 0 1 1.414 0l12 12a1 1 0 1 1-1.414 1.414l-12-12a1 1 0 0 1 0-1.414"
	/>
</svg>
