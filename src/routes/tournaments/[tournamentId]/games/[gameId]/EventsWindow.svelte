<script lang="ts">
	import type { Game } from '$lib/models/Game.svelte';
	import { formatGameTime } from '$lib/utils';
	import { Listgroup, ListgroupItem } from 'flowbite-svelte';

	let {
		game,
		flip = false,
		class: class_str
	}: { game: Game; flip: boolean; class: string } = $props();
	const rtl = flip ? 'rtl' : 'ltr';
	const ltr = flip ? 'ltr' : 'rtl';
</script>

<Listgroup class={class_str}>
	{#each game.events
		.toReversed()
		.filter((e) => !['pause', 'resume'].includes(e.eventType)) as event}
		<div dir={event.team == game.homeTeam.id ? ltr : rtl}>
			<ListgroupItem class="gap-0">
				<p class="grow-2 basis-0 text-center">{event.eventType}</p>
				<p class="grow-1 basis-0">{event.player ? `#${event.player}` : ''}</p>
				<p class="grow-1 basis-0 text-center text-gray-500">{formatGameTime(event.gameTime)}</p>
				<div class="grow-3 basis-0"></div>
			</ListgroupItem>
		</div>
	{/each}
</Listgroup>
