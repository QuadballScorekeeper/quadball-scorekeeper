
export class Game {
    teamA: string;
    scoreA: number;

    teamB: string;
    scoreB: number;

    gameTime: number;
    events: Array<number>;

    running: boolean;
    started: boolean;

    constructor(teamA: string, teamB: string) {
        this.started = true;

        this.teamA = teamA;
        this.teamB = teamB;

        this.scoreA = $state(0);
        this.scoreB = $state(0);
        this.gameTime = $state(0);
        this.running = $state(false);

        this.events = [];
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