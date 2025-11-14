import type { SelectPlayer, SelectTeam } from '$lib/server/db/schema';

export type TeamData = SelectTeam & {
	players: SelectPlayer[];
};

export class Team {
	id: number;
	name: string;
	goals: number;
	catch: boolean;
	score: number;
	timeoutAvailable: boolean;
	players: SelectPlayer[];

	constructor(teamData: TeamData) {
		this.id = teamData.id;
		this.name = teamData.name;
		this.goals = $state(0);
		this.catch = $state(false);
		this.score = $derived(this.goals + 3 * Number(this.catch));
		this.timeoutAvailable = $state(true);
		this.players = teamData.players.toSorted((a, b) => a.number - b.number);
	}
}
