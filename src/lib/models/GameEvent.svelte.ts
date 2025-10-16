import type { SelectGameEvent } from '$lib/server/db/schema';

export type PenaltyType = "blue_card" | "yellow_card" | "red_card" | "ejection";

export class GameEvent {
	eventNum: SelectGameEvent['eventNum'];
	game: SelectGameEvent["game"];
	eventType: SelectGameEvent['eventType'];
	team: SelectGameEvent['team'];
	player: SelectGameEvent['player'];
	timestamp: SelectGameEvent['timestamp'];
	gameTime: number;

	constructor(gameEventRow: SelectGameEvent, gameTime: number) {
		this.eventNum = gameEventRow.eventNum;
		this.game = gameEventRow.game;
		this.eventType = gameEventRow.eventType;
		this.team = gameEventRow.team;
		this.player = gameEventRow.player;
		this.timestamp = gameEventRow.timestamp;
		this.gameTime = gameTime;
	}
}
