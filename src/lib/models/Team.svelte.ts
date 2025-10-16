import type { SelectTeam } from '$lib/server/db/schema';
import type { Game } from './Game.svelte';
import type { GameEvent, PenaltyType } from './GameEvent.svelte';


export class Team {
	readonly id: SelectTeam['id'];
	readonly name: SelectTeam['name'];
	goals: number;
	catch: boolean;
	score: number;
	timeout: undefined | GameEvent;
	timeoutAvailable: boolean;
	game: Game;

	constructor(teamRow: SelectTeam, game: Game) {
		this.id = teamRow.id;
		this.name = teamRow.name;
		this.goals = $state(0);
		this.catch = $state(false);
		this.timeoutAvailable = $state(true);
		this.game = game;
		this.score = $derived(this.catch ? this.goals + 3 : this.goals)
	}

	public useTimeout() {
		this.timeoutAvailable = false;
		this.game.running = false;
		this.game.addEvent("timeout", null, this.id);
	}

	public addCatch(player: number | null) {
		this.catch = true;
		this.game.addEvent("catch", player, this.id);
	}

	public cancelTimeout() {
		this.timeoutAvailable = true;
		// Fjern timeoutevent
	}

	public async addGoal(player: number | null) {
		this.goals++;
		this.game.addEvent('goal', player, this.id);
	}

	public async addPenalty(player: number, penaltyType: PenaltyType) {
		this.game.addEvent(penaltyType, player, this.id);
	}

	public removeLastGoal() {
		if (this.goals < 1) return;
		this.goals--;

		const lastGoal = this.game.events.findLast(
			(event) => event.eventType == 'goal' && event.team == this.id
		);
		console.log('last goal by this team:', lastGoal);
		this.game.removeEvent(lastGoal!.eventNum);
	}
}
