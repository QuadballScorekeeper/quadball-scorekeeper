<script lang="ts">
	let { size = 24, className = '', ...rest } = $props();
</script>

<svg {...rest} class={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
	<path
		fill="currentColor"
		d="M12 1.897a3 3 0 0 1 2.459 1.282l.106.163 8.473 14.144.008.014A3 3 0 0 1 20.48 22H3.518a3 3 0 0 1-2.565-4.5l.008-.014L9.435 3.342A3 3 0 0 1 12 1.897m0 2a1 1 0 0 0-.855.482l-8.46 14.12a1 1 0 0 0 .856 1.5h16.918a1 1 0 0 0 .855-1.5l-8.46-14.12-.073-.106A1 1 0 0 0 12 3.897"
	/><path
		fill="currentColor"
		d="M11 13V9a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0M12.01 16a1 1 0 1 1 0 2H12a1 1 0 1 1 0-2z"
	/>
</svg>
