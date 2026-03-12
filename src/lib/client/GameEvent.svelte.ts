import type { SelectGameEvent } from '$lib/server/db/schema';

export type Score = {
	home: number;
	away: number;
	catch: 'home' | 'away' | false;
};

export class GameEvent {
	eventNum: SelectGameEvent['eventNum'];
	game: SelectGameEvent['game'];
	eventType: SelectGameEvent['eventType'];
	team: SelectGameEvent['team'];
	player: SelectGameEvent['player'];
	timestamp: SelectGameEvent['timestamp'];
	gameTime: number;
	score: Score;

	constructor(gameEventRow: SelectGameEvent, gameTime: number, score: Score) {
		this.eventNum = gameEventRow.eventNum;
		this.game = gameEventRow.game;
		this.eventType = gameEventRow.eventType;
		this.team = gameEventRow.team;
		this.player = gameEventRow.player;
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
}
