<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M16 21v-2a3 3 0 0 0-2.703-2.985L13 16H5a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0M12 7a3 3 0 1 0-6 0 3 3 0 0 0 6 0m2 0A5 5 0 1 1 4 7a5 5 0 0 1 10 0M22 21v-1.999l-.01-.248a3 3 0 0 0-2.24-2.655 1 1 0 1 1 .5-1.936A5 5 0 0 1 24 19V21a1 1 0 0 1-2 0M18.008 7.005a3 3 0 0 0-2.256-2.906 1 1 0 0 1 .496-1.938 5 5 0 0 1 3.76 4.844l-.004.208a5 5 0 0 1-3.756 4.636 1 1 0 0 1-.496-1.938 3 3 0 0 0 2.245-2.657z"
	/>
</svg>
