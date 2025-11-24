<script lang="ts">
	import { Dropdown, User } from '$lib/icons';

	let {
		type = 'text',
		inputmode = null,
		pattern = null,
		required = false,
		placeholder = null,
		value = $bindable(),
		options = null
	} = $props();

	if (type == 'number') {
		inputmode = 'numeric';
		pattern = '[0-9]+';
	}
</script>

<div class="icon-input">
	<User />
	<input type="text" bind:value {required} {placeholder} {pattern} {inputmode} />
	{#if options}
		<Dropdown />
	{/if}
</div>

<style>
	.icon-input {
		border: 1px solid var(--border-strong);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
	}
</style>
