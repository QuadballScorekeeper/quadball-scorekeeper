<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M4.52 2.122c.322-.175.713-.16 1.021.037l14 9a1 1 0 0 1 0 1.682l-14 9A1.001 1.001 0 0 1 4 21V3a1 1 0 0 1 .52-.878M6 19.168 17.15 12 6 4.831z"
	/>
</svg>
