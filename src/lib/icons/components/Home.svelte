<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="m20 9.488-8-6.221-8 6.221V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1zM22 20a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a1 1 0 0 1 .386-.789l9-7c.36-.28.867-.28 1.228 0l9 7A1 1 0 0 1 22 9z"
	/><path
		fill="currentColor"
		d="M14 22v-8h-4v8l-.005.102a1 1 0 0 1-1.99 0L8 22v-9l.005-.102A1 1 0 0 1 9 12h6a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0"
	/>
</svg>
