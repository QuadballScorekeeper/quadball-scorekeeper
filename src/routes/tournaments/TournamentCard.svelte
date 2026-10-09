<script lang="ts">
	import { Button } from '$lib/components/ui/Button';
	let { tournament } = $props();
</script>

<Button href="/tournaments/{tournament.id}">
	<div>
		<p class="name">{tournament.name}</p>
		<p>{tournament.start.toLocaleDateString([])} - {tournament.end.toLocaleDateString([])}</p>
	</div>
</Button>

<style>
	div {
		display: grid;
	}
	.name {
		font-size: var(--text-l);
	}
</style>
