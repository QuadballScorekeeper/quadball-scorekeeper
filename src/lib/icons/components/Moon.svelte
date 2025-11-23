<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79"
	/>
</svg>
