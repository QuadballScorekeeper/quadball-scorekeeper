import type { SelectGameEvent } from '$lib/server/db/schema';

export type Score = {
	home: number;
	away: number;
	catch: 'home' | 'away' | false;
};

export class GameEvent {
	eventNum: SelectGameEvent['eventNum'];
	gameId: SelectGameEvent['gameId'];
	eventType: SelectGameEvent['eventType'];
	teamId: SelectGameEvent['teamId'];
	playerNumber: SelectGameEvent['playerNumber'];
	timestamp: SelectGameEvent['timestamp'];
	gameTime: number;
	score: Score;

	constructor(gameEventRow: SelectGameEvent, gameTime: number, score: Score) {
		this.eventNum = gameEventRow.eventNum;
		this.gameId = gameEventRow.gameId;
		this.eventType = gameEventRow.eventType;
		this.teamId = gameEventRow.teamId;
		this.playerNumber = gameEventRow.playerNumber;
		this.timestamp = gameEventRow.timestamp;
		this.gameTime = gameTime;
		this.score = score;
	}

	static from(json: GameEvent) {
		return Object.create(GameEvent.prototype, Object.getOwnPropertyDescriptors(json));
	}

	public getIcon() {
		switch (this.eventType) {
			case 'goal':
				return '🏐';
			case 'catch':
				return '☄️';
			case 'timeout':
				return '⏸️';
			case 'blue_card':
				return '🟦';
			case 'yellow_card':
				return '🟨';
			case 'red_card':
				return '🟥';
			case 'ejection':
				return '🚫';
			default:
				return this.eventType;
		}
	}

	public getLabel() {
		switch (this.eventType) {
			case 'goal':
				return 'Goal';
			case 'catch':
				return 'Catch';
			case 'timeout':
				return 'Timeout';
			case 'blue_card':
				return 'Blue card';
			case 'yellow_card':
				return 'Yellow card';
			case 'red_card':
				return 'Red card';
			case 'ejection':
				return 'Ejection';
			default:
				return this.eventType;
		}
	}
}
