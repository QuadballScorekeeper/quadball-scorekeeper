<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M16.14 1a1 1 0 0 1 .707.293l5.86 5.86A1 1 0 0 1 23 7.86v8.28a1 1 0 0 1-.293.707l-5.86 5.86a1 1 0 0 1-.707.293H7.86a1 1 0 0 1-.707-.293l-5.86-5.86A1 1 0 0 1 1 16.14V7.86l.005-.1a1 1 0 0 1 .288-.607l5.86-5.86.074-.066A1 1 0 0 1 7.86 1zM3 8.274v7.452L8.274 21h7.452L21 15.726V8.274L15.726 3H8.274z"
	/><path
		fill="currentColor"
		d="M14.293 8.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 1 1-1.414-1.414z"
	/><path
		fill="currentColor"
		d="M8.293 8.293a1 1 0 0 1 1.414 0l6 6a1 1 0 1 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414"
	/>
</svg>
