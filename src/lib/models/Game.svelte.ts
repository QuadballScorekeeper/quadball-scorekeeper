import type { SelectGame, SelectGameEvent } from '../server/db/schema';
import { GameEvent, type PenaltyType } from './GameEvent.svelte';
import type { Team } from './Team.svelte';

export class Game {
	// gameRow: SelectGame;
	id: SelectGame['id'];
	start: SelectGame['start'];
	status: SelectGame['status'];
	homeTeam: Team;
	awayTeam: Team;
	events: GameEvent[];
	gameTime: number;
	totalPauseTime: number;
	currentPauseStart: number | null;
	running: boolean;
	runnerCaught: boolean;
	nextEvent: number;
	setScore: number | undefined;


	constructor(gameRow: SelectGame, homeTeam: Team, awayTeam: Team) {
		this.id = gameRow.id;
		this.start = gameRow.start;
		this.status = $state(gameRow.status);
		this.homeTeam = homeTeam;
		this.awayTeam = awayTeam;
		this.events = $state([]);
		this.gameTime = $state(0);
		this.totalPauseTime = 0;
		this.currentPauseStart = $state(this.start.getTime());
		this.running = $derived(this.currentPauseStart == null);
		this.runnerCaught = $derived(homeTeam.catch || awayTeam.catch);
		this.nextEvent = 0;
	}

	public translateRealTime(realTime: Date) {
		const currentTime = this.currentPauseStart ? this.currentPauseStart : realTime.getTime();
		return currentTime - (this.start.getTime() + this.totalPauseTime);
	}

	public async addEvent(
		eventType: SelectGameEvent['eventType'],
		player?: SelectGameEvent['player'],
		team?: SelectGameEvent["team"]
	) {
		console.log('adding event');
		const timestamp = Date.now();
		const newEvent = new GameEvent({
			game: this.id,
			eventNum: this.nextEvent,
			eventType: eventType,
			team: team ?? null,
			player: player ?? null,
			timestamp: new Date(timestamp)
		}, this.gameTime);

		this.events.push(newEvent)
		this.nextEvent++;

		const res = await fetch(`/api/events`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ newEvent })
		});
	}

	public async removeEvent(eventNum: SelectGameEvent['eventNum']) {
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
		this.addEvent('resume');
	}

	public async endGame() {
		this.running = false;
		this.addEvent('pause');
		this.status = "finished";
		const res = await fetch(`/api/games/${this.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ start: this.start, status: this.status })
		});
	}

	public resumeGame() {
		this.currentPauseStart = null;
		this.addEvent('resume');
	}

	public pauseGame() {
		this.currentPauseStart = Date.now();
		this.addEvent('pause');
	}


	public useTimeout(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		team.timeoutAvailable = false;
		this.running = false;
		this.addEvent("timeout", null, team.id);
	}

	public cancelTimeout(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		team.timeoutAvailable = true;
	}

	public addCatch(home: boolean, player: number | null) {
		const team = home ? this.homeTeam : this.awayTeam;
		const otherTeam = home ? this.awayTeam : this.homeTeam;
		team.catch = true;
		this.addEvent("catch", player, team.id);

		if (team.score > otherTeam.score) {
			this.endGame();
		} else {
			this.setScore = otherTeam.score + 3;
		}
	}

	public addGoal(home: boolean, player: number | null) {
		const team = home ? this.homeTeam : this.awayTeam;
		team.goals++;
		this.addEvent('goal', player, team.id);
		if (this.setScore && team.score >= this.setScore) this.endGame()
	}

	public addPenalty(home: boolean, player: number, penaltyType: PenaltyType) {
		const team = home ? this.homeTeam : this.awayTeam;
		this.addEvent(penaltyType, player, team.id);
	}

	public removeLastGoal(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		if (team.goals < 1) return;

		team.goals--;
		const lastGoal = this.events.findLast(
			(event) => event.eventType == 'goal' && event.team == team.id
		);
		this.removeEvent(lastGoal!.eventNum);
	}
}
