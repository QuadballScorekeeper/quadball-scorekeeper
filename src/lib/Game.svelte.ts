interface GameParams {
    teamA: string;
    teamB: string;
    scoreA: number;
    scoreB: number;
    events: Array<number>;
    gameTime: number;
    running: boolean;
}
export class Game {
    teamA: string;
    scoreA: number;

    teamB: string;
    scoreB: number;

    events: Array<number>;
    gameTime: number;
    running: boolean;

    constructor(teamA: string, teamB: string, scoreA: number = 0, scoreB: number = 0, events: Array<number> = [], gameTime: number = 0, running: boolean = false) {
        this.teamA = $state(teamA);
        this.teamB = $state(teamB);

        this.scoreA = $state(scoreA);
        this.scoreB = $state(scoreB);

        this.events = $state(events);
        this.gameTime = $state(gameTime);
        this.running = $state(running);
    }

    static fromParams(params: GameParams) {
        const { teamA, teamB, scoreA, scoreB, events, gameTime, running } = params
        return new Game(teamA, teamB, scoreA, scoreB, events, gameTime, running)
    }
    toggleRunning() {
        this.running = !this.running
    }
}

class Team {
    name: string;

    constructor(name: string) {
        this.name = name
    }
}