<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark' | 'system';

	let theme: Theme = $state('system');

	onMount(() => {
		theme = (localStorage.getItem('theme') as Theme | null) ?? 'system';
	});

	$effect(() => {
		localStorage.setItem('theme', theme);
		const root = document.documentElement;
		switch (theme) {
			case 'light':
				root.style.setProperty('color-scheme', 'light');
				break;
			case 'dark':
				root.style.setProperty('color-scheme', 'dark');
				break;
			default:
				root.style.setProperty('color-scheme', 'light dark');
				break;
		}
	});
</script>

<select id="theme-toggle" bind:value={theme}>
	<option value="system">🖥️</option>
	<option value="light">☀️</option>
	<option value="dark">🌑</option>
</select>

<style>
</style>
