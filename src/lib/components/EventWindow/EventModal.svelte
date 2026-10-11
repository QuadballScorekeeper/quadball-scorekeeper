<script lang="ts">
	import type { Game } from '$lib/client/Game.svelte';
	import { GameEvent } from '$lib/client/GameEvent.svelte';
	import { formatGameTime } from '$lib/utils';
	import { Button } from '$lib/components/ui/Button';
	import { Input } from '$lib/components/ui/Input';
	import { Modal } from '$lib/components/ui/Modal';

	let {
		game,
		event,
		open = $bindable(false)
	}: { game: Game; event: GameEvent; open?: boolean } = $props();

	const team = $derived(event.teamId == game.homeTeam.id ? game.homeTeam : game.awayTeam);
	const showsPlayerNumber = $derived(event.eventType != 'timeout');
	const requiresPlayerNumber = $derived(
		['blue_card', 'yellow_card', 'red_card', 'ejection'].includes(event.eventType)
	);

	let playerNumber = $state('');

	// Reset the field every time the modal opens, so stale input doesn't linger
	$effect(() => {
		if (open) playerNumber = event.playerNumber?.toString() ?? '';
	});

	function save() {
		game.editEvent(event.eventNum, playerNumber == '' ? null : Number(playerNumber));
		open = false;
	}

	function remove() {
		game.removeEvent(event.eventNum);
		open = false;
	}
</script>

<Modal bind:open title="{event.getIcon()} {event.getLabel()}">
	<div class="team-banner" style="--team-color: {team.color}">{team.name}</div>
	<dl class="info">
		{#if event.playerNumber != null}
			<div>
				<dt>Player</dt>
				<dd>#{event.playerNumber}</dd>
			</div>
		{/if}
		<div>
			<dt>Game time</dt>
			<dd>{formatGameTime(event.gameTime)}</dd>
		</div>
	</dl>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			save();
		}}
	>
		{#if showsPlayerNumber}
			<label class="player-edit">
				Player number
				<Input
					type="number"
					required={requiresPlayerNumber}
					placeholder="Number"
					bind:value={playerNumber}
				/>
			</label>
		{/if}
		<div class="actions">
			<Button type="submit">Save</Button>
			<Button variant="secondary" type="button" onclick={() => (open = false)}>Cancel</Button>
			<Button variant="destructive" type="button" onclick={remove}>Delete</Button>
		</div>
	</form>
</Modal>

<style>
	.team-banner {
		background-color: var(--team-color);
		color: var(--text-on-color);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		text-align: center;
	}
	.info {
		display: grid;
		gap: 0.25rem;
	}
	.info > div {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
	}
	.info dt {
		color: var(--text-subtle);
	}
	.info dd {
		font-family: var(--font-mono);
	}
	.player-edit {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}
</style>
