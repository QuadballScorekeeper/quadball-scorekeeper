<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M22 4a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1h-6a1 1 0 1 1 0-2h5zM0 20v-6a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H2v5a1 1 0 1 1-2 0"
	/><path
		fill="currentColor"
		d="M.271 13.315a1 1 0 0 1 1.413-.044l4.641 4.36.022.022a8 8 0 0 0 13.2-2.986 1 1 0 0 1 1.885.667 10 10 0 0 1-16.477 3.754L.315 14.73a1 1 0 0 1-.044-1.414M9.788 2.249a10 10 0 0 1 9.257 2.663l4.64 4.359a1 1 0 0 1-1.37 1.458l-4.64-4.36-.023-.022a8 8 0 0 0-13.2 2.987 1 1 0 0 1-1.885-.667 10 10 0 0 1 7.22-6.418"
	/>
</svg>
