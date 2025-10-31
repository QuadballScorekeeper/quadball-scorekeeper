<script lang="ts">
	import {
		Button,
		Datepicker,
		Label,
		Listgroup,
		ListgroupItem,
		Select,
		Timepicker
	} from 'flowbite-svelte';
	import { DeleteTableOutline } from 'flowbite-svelte-icons';
	let { data } = $props();
	let { tournament, games, teams } = data;
</script>

<main class="flex flex-col">
	<div class="flex flex-col items-center">
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
				value={tournament.start}
			/>
			<Label>Start time</Label>
			<Timepicker />
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
					<DeleteTableOutline />
				</ListgroupItem>
			{/each}
		</Listgroup>
	</div>
</main>

<style>
</style>
