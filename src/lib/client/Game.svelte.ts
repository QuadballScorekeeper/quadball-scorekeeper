import { SvelteDate } from 'svelte/reactivity';
import type { SelectGame, SelectGameEvent } from '../server/db/schema';
import { GameEvent, type PenaltyType, type Score } from './GameEvent.svelte';
import { Team, type TeamData } from './Team.svelte';

export type GameData = SelectGame & {
	homeTeam: TeamData;
	awayTeam: TeamData;
	events: SelectGameEvent[];
};

export class Game {
	id: SelectGame['id'];
	start: SelectGame['start'];
	status: SelectGame['status'];
	homeTeam: Team;
	awayTeam: Team;
	events: GameEvent[];
	score: Score;
	gameStart: Date | undefined;
	gameTime: number;
	running: boolean;
	runnerCaught: boolean;
	nextEvent: number;
	setScore: number | undefined;

	constructor(gameData: GameData) {
		this.id = gameData.id;
		this.start = gameData.start;
		this.status = $state(gameData.status);
		this.homeTeam = new Team(gameData.homeTeam);
		this.awayTeam = new Team(gameData.awayTeam);
		this.events = $state([]);
		this.gameTime = $state(0);
		this.running = $state(false);
		this.score = $derived({
			home: this.homeTeam.score,
			away: this.awayTeam.score,
			catch: (this.homeTeam.catch && 'home') || (this.awayTeam.catch && 'away')
		});
		this.runnerCaught = $derived(this.homeTeam.catch || this.awayTeam.catch);
		this.nextEvent = 0;

		this.replayEvents(gameData.events);
	}

	private replayEvents(events: SelectGameEvent[]) {
		const eventTeam = (teamId: number) => {
			if (teamId == this.homeTeam.id) return this.homeTeam;
			if (teamId == this.awayTeam.id) return this.awayTeam;
			throw Error('Invalid team ID: ' + teamId);
		};
		let totalPauseTime = 0;
		let pauseStart: number | null = null;
		for (const event of events) {
			switch (event.eventType) {
				case 'timeout':
					eventTeam(event.team!).timeoutAvailable = false;
				// falls through
				case 'pause':
					if (!this.running) break;
					this.running = false;
					pauseStart = event.timestamp.getTime();
					break;
				case 'resume':
					if (this.running || !pauseStart) break;
					this.running = true;
					totalPauseTime += new SvelteDate().getTime() - pauseStart;
					pauseStart = null;
					break;
				case 'goal':
					eventTeam(event.team!).goals++;
					break;
				case 'catch':
					eventTeam(event.team!).catch = true;
					break;
				case 'blue_card':
				case 'yellow_card':
				case 'red_card':
				case 'ejection':
					// Save card to team class
					break;

				default:
					break;
			}
			const now = pauseStart ?? event.timestamp.getTime() - totalPauseTime;
			this.gameTime = now - this.start.getTime();
			this.events.push(new GameEvent(event, this.gameTime, this.score));
			this.nextEvent = event.eventNum + 1;
		}
	}

	public async addEvent(
		eventType: SelectGameEvent['eventType'],
		player?: SelectGameEvent['player'],
		team?: SelectGameEvent['team']
	) {
		const timestamp = Date.now();
		const newEvent = new GameEvent(
			{
				game: this.id,
				eventNum: this.nextEvent,
				eventType: eventType,
				team: team ?? null,
				player: player ?? null,
				timestamp: new SvelteDate(timestamp)
			},
			this.gameTime,
			this.score
		);

		this.events.push(newEvent);
		this.nextEvent++;

		await fetch('/api/events', {
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

		await fetch(`/api/events`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ game: this.id, eventNum })
		});
	}

	public async startGame() {
		this.running = true;
		this.start = new SvelteDate();
		this.status = 'live';
		await fetch(`/api/games/${this.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ start: this.start, status: this.status })
		});
		this.addEvent('resume');
	}

	public async endGame() {
		this.running = false;
		this.addEvent('pause');
		this.status = 'finished';
		await fetch(`/api/games/${this.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ start: this.start, status: this.status })
		});
	}

	public resumeGame() {
		this.running = true;
		this.addEvent('resume');
	}

	public pauseGame() {
		this.running = false;
		this.addEvent('pause');
	}

	public useTimeout(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		team.timeoutAvailable = false;
		this.running = false;
		this.addEvent('timeout', null, team.id);
	}

	public cancelTimeout(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		team.timeoutAvailable = true;
	}

	public addCatch(home: boolean, player?: number) {
		const team = home ? this.homeTeam : this.awayTeam;
		const otherTeam = home ? this.awayTeam : this.homeTeam;
		team.catch = true;
		this.addEvent('catch', player ?? null, team.id);

		if (team.score > otherTeam.score) {
			this.endGame();
		} else {
			this.setScore = otherTeam.score + 3;
		}
	}

	public addGoal(home: boolean, player?: number) {
		const team = home ? this.homeTeam : this.awayTeam;
		team.goals++;
		this.addEvent('goal', player ?? null, team.id);
		if (this.setScore && team.score >= this.setScore) this.endGame();
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
