<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1"
	/>
</svg>
