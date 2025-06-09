import type { GameEventType } from "./GameEvent";

export interface GameParams {
    nameA: string;
    scoreA: number;
    nameB: string;
    scoreB: number;
    gameTime: number;
    running: boolean;
}

export const newGameParams: GameParams = {
    nameA: "Team A",
    nameB: "Team B",
    scoreA: 0,
    scoreB: 0,
    gameTime: 0,
    running: false,
}

export class Game {
    teamA: Team;
    teamB: Team;
    gameTime: number;
    running: boolean;
    events: Array<GameEventType>;

    constructor(teamA: string, teamB: string, scoreA: number = 0, scoreB: number = 0, gameTime: number = 0, running: boolean = false) {
        this.teamA = new Team(teamA, scoreA)
        this.teamB = new Team(teamB, scoreB)

        this.gameTime = $state(gameTime);
        this.running = $state(running);
        this.events = $state([]);
    }

    static fromParams(params: GameParams) {
        const { nameA, nameB, scoreA, scoreB, gameTime, running } = params
        return new Game(nameA, nameB, scoreA, scoreB, gameTime, running)
    }

    toggleRunning() {
        this.running = !this.running
    }
}

export class Team {
    name: string;
    score: number;

    constructor(name: string, score: number) {
        this.name = name
        this.score = $state(score)
    }
}