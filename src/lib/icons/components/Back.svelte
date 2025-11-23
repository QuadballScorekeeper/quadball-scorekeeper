<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M11.293 4.293a1 1 0 1 1 1.414 1.414L7.414 11H19a1 1 0 1 1 0 2H7.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1-.193-.274 1 1 0 0 1-.057-.142l-.013-.05a1 1 0 0 1-.003-.472l.016-.062a1 1 0 0 1 .057-.14 1 1 0 0 1 .193-.274z"
	/>
</svg>
