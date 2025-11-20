import type { SelectPlayer, SelectTeam } from '$lib/server/db/schema';
import { Penalty, type PenaltyType } from './Penalty.svelte';

export type TeamData = SelectTeam & {
	players: SelectPlayer[];
};

export class Team {
	id: number;
	name: string;
	goals: number;
	catch: boolean;
	score: number;
	color: string;
	timeoutAvailable: boolean;
	players: SelectPlayer[];
	penalties: Penalty[];
	activePenalties: Penalty[];

	constructor(teamData: TeamData) {
		this.id = teamData.id;
		this.name = teamData.name;
		this.goals = $state(0);
		this.catch = $state(false);
		this.score = $derived(this.goals + 3 * Number(this.catch));
		this.timeoutAvailable = $state(true);
		this.players = teamData.players.toSorted((a, b) => a.number - b.number);
		this.color = '#FFFFFF';
		this.penalties = $state([]);
		this.activePenalties = $derived(
			this.penalties.filter((p) => p.active).toSorted((a, b) => a.timeLeft - b.timeLeft)
		);
	}

	public addPenalty(type: PenaltyType, player: number) {
		this.penalties.push(new Penalty(type, this.id, player));
	}

	public removePenaltyTimes(time: number) {
		this.penalties.forEach((penalty) => penalty.removeTime(time));
	}

	public releaseFirstPenalty() {
		const penalty = this.activePenalties.find((penalty) => penalty.type != 'red_card');
		if (penalty) {
			penalty.release();
		}
	}
}
