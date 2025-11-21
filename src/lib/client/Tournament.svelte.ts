import type { SelectTournament } from '$lib/server/db/schema';
import { Game, type GameData } from './Game.svelte';
import { Team, type TeamData } from './Team.svelte';

export type TournamentData = SelectTournament & {
	games: GameData[];
	teams: TeamData[];
};

export class Tournament {
	id: SelectTournament['id'];
	name: SelectTournament['name'];
	start: SelectTournament['start'];
	end: SelectTournament['end'];
	games: Game[];
	teams: Team[];

	constructor(tournamentData: TournamentData) {
		this.id = tournamentData.id;
		this.name = tournamentData.name;
		this.start = tournamentData.start;
		this.end = tournamentData.end;
		this.games = tournamentData.games.map((gameData) => new Game(gameData));
		this.teams = tournamentData.teams.map((teamData) => new Team(teamData));
	}
}
