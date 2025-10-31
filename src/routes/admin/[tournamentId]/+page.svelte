<script lang="ts">
	import { Button, Datepicker, Input, Label } from 'flowbite-svelte';

	let { data } = $props();
	const tournament = data.tournament;
	let name = $state(tournament.name);
	let start = $state(tournament.start);
	let startString = $derived(start?.toDateString());
	let end = $state(tournament.end);
	let endString = $derived(end?.toDateString());
</script>

<main class="gap-2">
	<form class="grid gap-2" method="POST" action="?/saveTournament">
		<Label>Name</Label>
		<Input type="text" name="name" bind:value={name} />
		<Label>Duration</Label>
		<Input name="start" type="hidden" bind:value={startString} />
		<Input name="end" type="hidden" bind:value={endString} />
		<div class="w-52">
			<Datepicker
				range
				color="secondary"
				bind:rangeFrom={start}
				bind:rangeTo={end}
				firstDayOfWeek={1}
			/>
		</div>
		<div class="grid grid-cols-2">
			<Button type="submit" class="w-20">Save</Button>
			<Button type="submit" formaction="?/deleteTournament" class="w-20 bg-red-700 dark:bg-red-900"
				>Delete</Button
			>
		</div>
	</form>
</main>
