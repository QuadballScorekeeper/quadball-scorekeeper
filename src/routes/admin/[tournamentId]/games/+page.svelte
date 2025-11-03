<script lang="ts">
	import {
		Button,
		Datepicker,
		Input,
		Label,
		Listgroup,
		ListgroupItem,
		Select,
		Timepicker
	} from 'flowbite-svelte';
	import { DeleteTableOutline } from 'flowbite-svelte-icons';
	let { data } = $props();
	let { tournament, games, teams } = data;
	let startDate: Date = $state(tournament.start);
	let startTime = $state('08:00');
	let startString = $derived(startDate?.toDateString() + ' ' + startTime);
</script>

<main class="gap-2">
	<h1>{tournament.name}</h1>

	<h2>Add a new game</h2>
	<form method="POST" action="?/newGame">
		<div class="grid grid-cols-2 gap-2">
			<div>
				<Label>Home team</Label>
				<Select name="homeTeam">
					{#each teams as team}
						<option value={team.id}>{team.name}</option>
					{/each}
				</Select>
			</div>
			<div>
				<Label>Away team</Label>
				<Select name="awayTeam">
					{#each teams as team}
						<option value={team.id}>{team.name}</option>
					{/each}
				</Select>
			</div>
		</div>
		<Label>Date</Label>
		<Datepicker
			firstDayOfWeek={1}
			availableFrom={tournament.start}
			availableTo={tournament.end}
			bind:value={startDate}
		/>
		<Label>Start time</Label>
		<Timepicker bind:value={startTime} />
		<Input type="hidden" name="start" bind:value={startString} />
		<Button type="submit">Add game</Button>
	</form>

	<Listgroup class="w-100">
		{#each games as game}
			<ListgroupItem>
				<strong class="grow basis-0">
					{game.homeTeam.name}
				</strong>
				<div class="grow basis-0 text-center">
					{game.start.toLocaleDateString()}
				</div>
				<strong class="grow basis-0 text-right">
					{game.awayTeam.name}
				</strong>
				<form method="POST" action="?/deleteGame">
					<Input type="hidden" name="game" value={game.id} />
					<button class="cursor-pointer">
						<DeleteTableOutline />
					</button>
				</form>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>

<style>
</style>
