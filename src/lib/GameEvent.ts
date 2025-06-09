import { Team } from "$lib/Game.svelte";

export type GameEventType = {
    gameTime: number;
    team: Team;
    eventInfo: () => string;
}

export class GoalEvent implements GameEventType {
    gameTime: number;
    team: Team;
    player: string | undefined;

    constructor(gameTime: number, team: Team, player?: string) {
        this.gameTime = gameTime;
        this.team = team;
        this.player = player;
    }

    eventInfo() {
        if (this.player) {
            return `Goal by #${this.player}`;
        }
        return "Goal";
    }
}

export enum PenaltyTypes {
    BLUE = "Blue",
    YELLOW = "Yellow",
    RED = "Red",
    EJECTION = "Ejection",
}

export class PenaltyEvent implements GameEventType {
    gameTime: number;
    team: Team;
    player: string; //UUID?
    penaltyType: PenaltyTypes;

    constructor(gameTime: number, team: Team, player: string, penaltyType: PenaltyTypes) {
        this.gameTime = gameTime;
        this.team = team;
        this.player = player;
        this.penaltyType = penaltyType;
    }

    eventInfo() {
        return `Penalty ${this.penaltyType} for Player ${this.player}`
    }
}

export class TimeOutEvent implements GameEventType {
    gameTime: number;
    team: Team;

    constructor(gameTime: number, team: Team) {
        this.gameTime = gameTime;
        this.team = team;
    }
    eventInfo() {
        return `Timeout`
    }
}
