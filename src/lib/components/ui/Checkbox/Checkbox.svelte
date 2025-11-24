<script lang="ts">
	let { checked = $bindable() } = $props();
</script>

<input type="checkbox" bind:checked />

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
