<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M3 20V4a3 3 0 0 1 3-3h8l.099.005a1 1 0 0 1 .608.288l6 6A1 1 0 0 1 21 8v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3m2 0a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.414L13.586 3H6a1 1 0 0 0-1 1z"
	/><path
		fill="currentColor"
		d="M13 2a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1zM11 18v-6a1 1 0 1 1 2 0v6a1 1 0 1 1-2 0"
	/><path fill="currentColor" d="M15 14a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2z" />
</svg>
