<script lang="ts">
	import type { GameEvent } from '$lib/models/GameEvent.svelte';

	let { event }: { event: GameEvent } = $props();
</script>

<div>
	{#if event.eventType == 'goal'}
		<h1>Goal for {event.team}</h1>
	{/if}
</div>
