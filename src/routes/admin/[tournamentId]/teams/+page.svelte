<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Button,
		Input,
		Listgroup,
		ListgroupItem
	} from 'flowbite-svelte';
	let { data } = $props();
	let { tournament, teamsWithPlayers } = data;
</script>

<main class="gap-2">
	<h1>{tournament.name}</h1>

	<h2>Add a new team</h2>
	<form method="POST" action="?/newTeam">
		<Input type="text" name="teamName" placeholder="Team name" required class="mb-2" />
		<Button type="submit">Add</Button>
	</form>

	<Accordion class="dark:bg-primary-900 w-100">
		{#each teamsWithPlayers as team}
			<AccordionItem>
				{#snippet header()}
					{team.name}
				{/snippet}
				<form method="POST" action="?/newPlayer">
					<Input type="hidden" name="teamId" value={team.id} />
					<div class="mb-4 grid grid-cols-2 gap-4">
						<Input type="text" name="playerName" placeholder="Name" required />
						<Input type="number" name="playerNumber" placeholder="Number" required />
					</div>
					<Button type="submit">Add</Button>
				</form>
				<Listgroup>
					{#each team.players as player}
						<ListgroupItem>
							#{player.number} - {player.name}
						</ListgroupItem>
					{/each}
				</Listgroup>
				<Button>Delete team</Button>
			</AccordionItem>
		{/each}
	</Accordion>
</main>

<style>
</style>
