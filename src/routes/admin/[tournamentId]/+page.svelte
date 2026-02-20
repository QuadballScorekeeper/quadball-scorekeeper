<script lang="ts">
	import { Button } from '$lib/components/ui/Button';
	let { data } = $props();
	const tournament = data.tournament;
	let name = $state(tournament.name);
	let startString = $derived(tournament.start.toISOString().split('T')[0]);
	let endString = $derived(tournament.end.toISOString().split('T')[0]);
</script>

<main>
	<form method="POST" action="?/saveTournament">
		<label for="name">Name</label>
		<input type="text" id="name" name="name" bind:value={name} />
		<label for="start">Start</label>
		<input name="start" id="start" type="date" bind:value={startString} />
		<label for="end">End</label>
		<input name="end" id="end" type="date" bind:value={endString} />
		<div class="button-group">
			<Button type="submit">Save</Button>
			<Button classStr="destructive" formaction="?/deleteTournament">Delete</Button>
		</div>
	</form>
</main>

<style>
	form {
		display: grid;
		gap: 0.5rem;
		min-width: 20rem;
	}
	.button-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}
	input {
		background-color: var(--surface-0);
		border-radius: 0.5rem;
	}
</style>
