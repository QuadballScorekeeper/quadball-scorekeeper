<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M12 17a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4"
	/>
</svg>
