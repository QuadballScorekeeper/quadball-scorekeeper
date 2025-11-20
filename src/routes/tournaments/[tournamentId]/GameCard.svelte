<script lang="ts">
	import { page } from '$app/state';
	import { Game } from '$lib/client/Game.svelte.js';
	import { Team } from '$lib/client/Team.svelte';
	import { formatGameTime } from '$lib/utils';

	let { game }: { game: Game } = $props();
</script>

{#snippet teamInfo(team: Team)}
	<div class="team-info">
		<div>
			{team.name}
		</div>
		<div class="score">
			{team.score}
			<div class="catch">
				{team.catch ? '*' : ''}
			</div>
		</div>
	</div>
{/snippet}

<a href="{page.url}/game/{game.id}" class="game">
	<div class="teams">
		{@render teamInfo(game.homeTeam)}
		{@render teamInfo(game.awayTeam)}
	</div>
	<div class="right">
		<div class="game-info {game.status}">
			<div>
				{#if game.status == 'scheduled'}
					{game.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				{:else if ['live', 'timeout', 'paused'].includes(game.status)}
					{formatGameTime(game.gameTime)}
				{:else if game.status == 'finished'}
					{formatGameTime(game.gameTime)}
				{/if}
			</div>
		</div>
	</div>
</a>

<style>
	.game {
		max-width: 32rem;
		width: 100%;
		height: 5rem;
		margin-inline: auto;
		background-color: light-dark(var(--white), var(--gray-700));
		padding: 0.75rem 0;
		border-radius: 0.5rem;
		display: flex;
	}

	.teams {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid light-dark(var(--gray-300), var(--gray-600));
		padding: 0 1.5rem;
		width: 100%;
	}
	.team-info {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.right {
		width: 8rem;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.game-info {
		width: 5rem;
		text-align: center;
		padding: 0.25rem 1.5rem;
		border-radius: 1.5rem;
		margin-inline: auto;
		font-size: var(--text-xs);
	}
	.finished {
		background-color: var(--info);
		color: var(--white);
	}
	.finished {
		background-color: var(--success);
		color: var(--black);
	}
	.cancelled {
		background-color: var(--error);
		color: var(--white);
	}
	.live,
	.paused,
	.timeout {
		background-color: var(--info);
		color: var(--white);
	}
	.score {
		display: flex;
	}
	.catch {
		width: 0;
	}
</style>
