<script lang="ts">
	import { NavBar } from '$lib/components/NavBar';

	let { params, children } = $props();
</script>

<NavBar>
	<a href="/admin/{params.tournamentId}">Admin</a>
	<a href="/admin/{params.tournamentId}/games">Games</a>
	<a href="/admin/{params.tournamentId}/teams">Teams</a>
</NavBar>

{@render children?.()}
