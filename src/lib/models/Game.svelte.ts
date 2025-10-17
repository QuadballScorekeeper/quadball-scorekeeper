import type { SelectGame, SelectGameEvent } from '../server/db/schema';
import { GameEvent } from './GameEvent.svelte';

export class Game {
	// gameRow: SelectGame;
	id: SelectGame['id'];
	start: SelectGame['start'];
	status: SelectGame['status'];
	homeTeam: SelectGame["homeTeam"];
	awayTeam: SelectGame["awayTeam"];
	events: GameEvent[];
	gameTime: number;
	totalPauseTime: number;
	currentPauseStart: number | null;
	running: boolean;
	runnerCaught: boolean;
	nextEvent: number;

	constructor(gameRow: SelectGame) {
		this.id = gameRow.id;
		this.start = gameRow.start;
		this.status = $state(gameRow.status);
		this.homeTeam = gameRow.homeTeam;
		this.awayTeam = gameRow.awayTeam;
		this.events = $state([]);
		this.gameTime = $state(0);
		this.totalPauseTime = 0;
		this.currentPauseStart = $state(this.start.getTime());
		this.running = $derived(this.currentPauseStart == null);
		this.runnerCaught = $state(false);
		this.nextEvent = 0;
	}

	public translateRealTime(realTime: Date) {
		const currentTime = this.currentPauseStart ? this.currentPauseStart : realTime.getTime();
		return currentTime - (this.start.getTime() + this.totalPauseTime);
	}

	public async addEvent(
		eventType: SelectGameEvent['eventType'],
		player?: SelectGameEvent['player'],
		team?: SelectGameEvent['team']
	) {
		console.log('adding event');
		const timestamp = Date.now();

		const newEvent = new GameEvent({
			game: this.id,
			eventNum: this.nextEvent,
			eventType: eventType,
			team: team ? team : null,
			player: player ? player : null,
			timestamp: new Date(timestamp)
		}, this.gameTime);

		this.events.push(newEvent)
		this.nextEvent++;

		const res = await fetch(`/api/events`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ newEvent })
		});
		console.log('result from event', res);
	}

	public async removeEvent(eventNum: SelectGameEvent['eventNum']) {
		console.log('removing event');

		const index = this.events.findIndex((event) => event.eventNum == eventNum);
		if (index == -1) {
			console.error('Trying to delete non-existent event??');
			return;
		}
		this.events.splice(index, 1);

		const res = await fetch(`/api/events`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ game: this.id, eventNum })
		});
		console.log('result from event', res);
	}

	public async startGame() {
		this.currentPauseStart = null;
		this.start = new Date();
		this.status = "live";
		const res = await fetch(`/api/games/${this.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ start: this.start, status: this.status })
		});
		console.log('result from updating game', res);
		this.addEvent('resume');
	}

	public resumeGame() {
		this.currentPauseStart = null;
		this.addEvent('resume');
	}

	public pauseGame() {
		this.currentPauseStart = Date.now();
		this.addEvent('pause');
	}
}
