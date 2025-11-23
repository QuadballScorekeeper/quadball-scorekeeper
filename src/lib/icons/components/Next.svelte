<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M11.293 4.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 .25.414l.015.062q.027.111.028.231-.001.125-.031.24l-.013.051a1 1 0 0 1-.165.317 1 1 0 0 1-.084.1l-7 7a1 1 0 0 1-1.414-1.415L16.586 13H5a1 1 0 0 1 0-2h11.586l-5.293-5.293a1 1 0 0 1 0-1.414"
	/>
</svg>
