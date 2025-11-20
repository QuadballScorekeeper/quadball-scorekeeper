<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';

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

<NavBar />

<main>
	<button class="w-40" onclick={openModal}>Create tournament</button>

	<dialog {open}>
		<form method="POST">
			<input name="name" type="text" placeholder="Tournament name" bind:value={name} required />
			<button class="submit" type="submit">Create</button>
			<button class="cancel" onclick={closeModal}>Cancel</button>
		</form>
	</dialog>

	<h1>Tournaments you can manage</h1>
	<ul>
		{#each tournaments as t (t.id)}
			<li>
				<a href="/admin/{t.id}">
					<p>{t.name}</p>
					<p>{t.start.toLocaleDateString([])} - {t.end.toLocaleDateString([])}</p>
				</a>
			</li>
		{/each}
	</ul>
</main>

<style>
	button {
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
	}
	main {
		gap: 1rem;
	}
	dialog {
		margin-inline: auto;
	}
	ul {
		display: grid;
		gap: 0.625rem;
	}
	li {
		width: 12rem;
		border-radius: 0.5rem;
		padding: 0.25rem 0.5rem;
	}
</style>
