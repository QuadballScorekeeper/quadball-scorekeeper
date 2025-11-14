<script lang="ts">
	import {
		Button,
		Input,
		Listgroup,
		ListgroupItem,
		Modal,
		Navbar,
		NavBrand
	} from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';

	let { data } = $props();
	let { tournaments } = data;

	let name: string | undefined = $state();

	let open: boolean = $state(false);
	const openModal = () => {
		open = true;
	};
	const closeModal = () => {
		name = undefined;
		open = false;
	};
</script>

<Navbar class="bg-primary-50 dark:bg-primary-900">
	<NavBrand href="/">
		<h1>Scorekeeper</h1>
	</NavBrand>
	<DarkMode class="dark:text-primary-50 text-primary-900" />
</Navbar>

<main>
	<Button class="w-40" onclick={openModal}>Create tournament</Button>

	<Modal bind:open>
		<form method="POST">
			<Input name="name" type="text" placeholder="Tournament name" bind:value={name} required />
			<Button type="submit">Create</Button>
			<Button color="alternative" onclick={closeModal}>Cancel</Button>
		</form>
	</Modal>

	<h1>Tournaments you can manage</h1>
	<Listgroup active>
		{#each tournaments as t (t.id)}
			<ListgroupItem href="/admin/{t.id}" class="flex flex-col">
				<p>{t.name}</p>
				<p>{t.start.toLocaleDateString([])} - {t.end.toLocaleDateString([])}</p>
			</ListgroupItem>
		{/each}
	</Listgroup>
</main>

<style>
	main {
		gap: 1rem;
	}
</style>
