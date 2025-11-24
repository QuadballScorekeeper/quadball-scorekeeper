<script lang="ts">
	let { name, selected = $bindable(), value } = $props();
</script>

<input type="radio" bind:group={selected} {name} {value} />

<!-- Add custom svg icon as checkmark! -->

<style>
	input {
		background-color: var(--surface-0);
		border: 1px solid light-dark(var(--gray-600), var(--gray-150));
		border-radius: 2px;
		height: 1rem;
		width: 1rem;
	}
</style>
