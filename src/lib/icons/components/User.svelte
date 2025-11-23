<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M19 21v-2a3 3 0 0 0-2.703-2.985L16 16H8a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0M15 7a3 3 0 1 0-6 0 3 3 0 0 0 6 0m2 0A5 5 0 1 1 7 7a5 5 0 0 1 10 0"
	/>
</svg>
