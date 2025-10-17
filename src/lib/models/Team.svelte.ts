import type { SelectTeam } from '$lib/server/db/schema';
import type { GameEvent } from './GameEvent.svelte';


export class Team {
	readonly id: SelectTeam['id'];
	readonly name: SelectTeam['name'];
	goals: number;
	catch: boolean;
	score: number;
	timeout: undefined | GameEvent;
	timeoutAvailable: boolean;

	constructor(teamRow: SelectTeam) {
		this.id = teamRow.id;
		this.name = teamRow.name;
		this.goals = $state(0);
		this.catch = $state(false);
		this.timeoutAvailable = $state(true);
		this.score = $derived(this.catch ? this.goals + 3 : this.goals)
	}

}
