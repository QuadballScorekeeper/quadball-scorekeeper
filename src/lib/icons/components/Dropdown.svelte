<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M11.37 3.225a1 1 0 0 1 1.337.068l4 4a1 1 0 1 1-1.414 1.414L12 5.414 8.707 8.707a1 1 0 1 1-1.414-1.414l4-4zM11.37 20.775a1 1 0 0 0 1.337-.068l4-4a1 1 0 1 0-1.414-1.414L12 18.586l-3.293-3.293a1 1 0 1 0-1.414 1.414l4 4z"
	/>
</svg>
