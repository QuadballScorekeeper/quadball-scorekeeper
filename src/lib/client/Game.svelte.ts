import { SvelteDate } from 'svelte/reactivity';
import type { SelectGame, SelectGameEvent } from '../server/db/schema';
import { GameEvent, type Score } from './GameEvent.svelte';
import { Team, type TeamData } from './Team.svelte';
import type { PenaltyType } from './Penalty.svelte';

/**
 * Derived on the client by replaying the event log
 * 'cancelled' is reserved for a future cancel-game feature
 */
export type GameStatus = 'scheduled' | 'live' | 'finished' | 'cancelled' | 'paused' | 'timeout';

/** Only what a Game actually needs, so local games don't have to fake database rows. */
export type GameData = Pick<SelectGame, 'id' | 'scheduledStart'> & {
	homeTeam: TeamData;
	awayTeam: TeamData;
	events: SelectGameEvent[];
};

export class Game {
	id: SelectGame['id'];
	/** When the game was scheduled to kick off. Fixed; see actualStart for when it did. */
	scheduledStart: SelectGame['scheduledStart'];
	status: GameStatus;
	homeTeam: Team;
	awayTeam: Team;
	events: GameEvent[];
	score: Score;
	/** Timestamp of the 'start' event, undefined until the game has been started. */
	actualStart: Date | undefined;
	gameTime: number;
	runnerCaught: boolean;
	nextEvent: number;
	setScore: number | undefined;
	loaded: boolean;

	constructor(gameData: GameData) {
		this.id = gameData.id;
		this.scheduledStart = gameData.scheduledStart;
		// Derived from the events replayed below ('cancelled' is not producible yet)
		this.status = $state('scheduled');
		this.homeTeam = new Team(gameData.homeTeam);
		this.awayTeam = new Team(gameData.awayTeam);

		this.events = $state([]);
		this.gameTime = $state(0);
		this.score = $derived({
			home: this.homeTeam.score,
			away: this.awayTeam.score,
			catch: (this.homeTeam.catch && 'home') || (this.awayTeam.catch && 'away')
		});
		this.actualStart = $state(undefined);
		this.setScore = $state(undefined);
		this.runnerCaught = $derived(this.homeTeam.catch || this.awayTeam.catch);
		this.nextEvent = 0;
		this.loaded = $state(false);

		this.replayEvents(gameData.events);
		// Use queueMicrotask to ensure loaded is set after reactive state updates
		queueMicrotask(() => {
			this.loaded = true;
		});
	}

	private teamOf(teamId: SelectGameEvent['teamId']) {
		if (teamId == this.homeTeam.id) return this.homeTeam;
		if (teamId == this.awayTeam.id) return this.awayTeam;
		throw Error('Invalid team ID: ' + teamId);
	}

	private opponentOf(teamId: SelectGameEvent['teamId']) {
		return this.teamOf(teamId) == this.homeTeam ? this.awayTeam : this.homeTeam;
	}

	/**
	 * Fold a single event into the game state. The one place where an event type decides what
	 * happens, so replaying a log, receiving a live event and scoring locally cannot diverge.
	 */
	private applyEvent(event: SelectGameEvent) {
		switch (event.eventType) {
			case 'timeout':
				this.teamOf(event.teamId).timeoutAvailable = false;
				this.status = 'timeout';
				break;
			case 'pause':
				this.status = 'paused';
				break;
			case 'resume':
				this.status = 'live';
				break;
			case 'goal':
				this.teamOf(event.teamId).goals++;
				this.opponentOf(event.teamId).releaseFirstPenalty();
				break;
			case 'catch': {
				const team = this.teamOf(event.teamId);
				const opponent = this.opponentOf(event.teamId);
				team.catch = true;
				opponent.releaseFirstPenalty();
				// Catching from behind takes the game to overtime with a score to chase
				if (team.score <= opponent.score) this.setScore = opponent.score + 3;
				break;
			}
			case 'blue_card':
			case 'yellow_card':
			case 'red_card':
			case 'ejection':
				this.teamOf(event.teamId).addPenalty(event.eventType, event.playerNumber!, this.gameTime);
				break;
			case 'start':
				this.status = 'live';
				// Events arriving over the stream have been through JSON, so may carry a string
				this.actualStart = new SvelteDate(event.timestamp);
				break;
			case 'end':
				this.status = 'finished';
				break;

			default:
				break;
		}
	}

	public replayEvents(events: SelectGameEvent[]) {
		let lastEventTime = this.scheduledStart.getTime();
		for (const event of events) {
			// Only time between events of a running game counts towards the game clock
			if (this.status == 'live') {
				const elapsedTime = event.timestamp.getTime() - lastEventTime;
				this.gameTime += elapsedTime;
				this.homeTeam.removePenaltyTimes(elapsedTime);
				this.awayTeam.removePenaltyTimes(elapsedTime);
			}

			this.applyEvent(event);

			lastEventTime = event.timestamp.getTime();
			this.events.push(new GameEvent(event, this.gameTime, this.score));
			this.nextEvent = event.eventNum + 1;
		}

		if (this.status == 'live') {
			const elapsedTime = Date.now() - lastEventTime;
			this.gameTime += elapsedTime;
			this.homeTeam.removePenaltyTimes(elapsedTime);
			this.awayTeam.removePenaltyTimes(elapsedTime);
		}
	}

	/** Apply an event that came in from another scorekeeper over the event stream. */
	public updateFromEvent(event: GameEvent) {
		// Events arriving over the stream have been through JSON, so the timestamp is a
		// string — normalize it so GameEvent.timestamp is always an actual Date
		event.timestamp = new SvelteDate(event.timestamp);

		// Game time was already calculated by the sender
		this.gameTime = event.gameTime;

		this.events.push(event);
		this.applyEvent(event);
		this.nextEvent = event.eventNum + 1;
	}

	/**
	 * Rebuild the whole game state from a fresh event log, e.g. fetched after the scorekeeper
	 * edited or removed an event. The payload has been through JSON, so timestamps are strings.
	 */
	public reloadEvents(events: SelectGameEvent[]) {
		this.recalculateGameState(
			events.map((event) => ({ ...event, timestamp: new SvelteDate(event.timestamp) }))
		);
	}

	public async addEvent(
		eventType: SelectGameEvent['eventType'],
		playerNumber?: SelectGameEvent['playerNumber'],
		teamId?: SelectGameEvent['teamId']
	) {
		const row: SelectGameEvent = {
			gameId: this.id,
			eventNum: this.nextEvent,
			eventType: eventType,
			teamId: teamId ?? null,
			playerNumber: playerNumber ?? null,
			timestamp: new SvelteDate()
		};

		this.applyEvent(row);

		const newEvent = new GameEvent(row, this.gameTime, this.score);
		this.events.push(newEvent);
		this.nextEvent++;

		await this.persistEvent(newEvent);
	}

	public async removeEvent(eventNum: SelectGameEvent['eventNum']) {
		const index = this.events.findIndex((event) => event.eventNum == eventNum);
		if (index == -1) {
			console.error('Trying to delete non-existent event??');
			return;
		}

		this.events.splice(index, 1);

		// Recalculate game state by replaying all remaining events
		this.recalculateGameState(this.events);

		await this.persistEventRemoval(eventNum);
	}

	/**
	 * Edit the player number of an event. The whole game state is recalculated afterwards, since
	 * penalties are keyed by player number and must be re-derived from the event log.
	 */
	public async editEvent(
		eventNum: SelectGameEvent['eventNum'],
		playerNumber: SelectGameEvent['playerNumber']
	) {
		const event = this.events.find((event) => event.eventNum == eventNum);
		if (!event) {
			console.error('Trying to edit non-existent event??');
			return;
		}

		event.playerNumber = playerNumber;

		this.recalculateGameState(this.events);

		await this.persistEventEdit(event);
	}

	protected async persistEvent(event: GameEvent) {
		await fetch('/api/events', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ newEvent: event })
		});
	}

	protected async persistEventRemoval(eventNum: SelectGameEvent['eventNum']) {
		await fetch('/api/events', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ gameId: this.id, eventNum })
		});
	}

	protected async persistEventEdit(event: GameEvent) {
		await fetch('/api/events', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				gameId: event.gameId,
				eventNum: event.eventNum,
				playerNumber: event.playerNumber
			})
		});
	}

	protected recalculateGameState(events: SelectGameEvent[]) {
		// Reset game state
		this.status = 'scheduled';
		this.gameTime = 0;
		this.homeTeam.goals = 0;
		this.awayTeam.goals = 0;
		this.homeTeam.catch = false;
		this.awayTeam.catch = false;
		this.homeTeam.penalties = [];
		this.awayTeam.penalties = [];
		this.homeTeam.timeoutAvailable = true;
		this.awayTeam.timeoutAvailable = true;
		this.events = [];
		this.nextEvent = 0;
		this.actualStart = undefined;
		this.setScore = undefined;

		// Replay all events
		this.replayEvents(events);
	}

	public async startGame() {
		await this.addEvent('start');
	}

	public async endGame() {
		await this.addEvent('end');
	}

	public resumeGame() {
		this.addEvent('resume');
	}

	public pauseGame() {
		this.addEvent('pause');
	}

	public useTimeout(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		this.addEvent('timeout', null, team.id);
	}

	public cancelTimeout(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		team.timeoutAvailable = true;
	}

	public addCatch(home: boolean, playerNumber?: number) {
		const team = home ? this.homeTeam : this.awayTeam;
		const otherTeam = home ? this.awayTeam : this.homeTeam;
		this.addEvent('catch', playerNumber ?? null, team.id);

		// Catching in the lead ends the game, otherwise applyEvent has set an overtime score
		if (team.score > otherTeam.score) this.endGame();
	}

	public addGoal(home: boolean, playerNumber?: number) {
		const team = home ? this.homeTeam : this.awayTeam;
		this.addEvent('goal', playerNumber ?? null, team.id);
		if (this.setScore && team.score >= this.setScore) this.endGame();
	}

	public addPenalty(home: boolean, playerNumber: number, penaltyType: PenaltyType) {
		const team = home ? this.homeTeam : this.awayTeam;
		this.addEvent(penaltyType, playerNumber, team.id);
	}

	public removeLastGoal(home: boolean) {
		const team = home ? this.homeTeam : this.awayTeam;
		if (team.goals < 1) return;

		const lastGoal = this.events.findLast(
			(event) => event.eventType == 'goal' && event.teamId == team.id
		);
		if (!lastGoal) return;

		this.removeEvent(lastGoal.eventNum);
	}

	public getLastEventTime(): number {
		const lastEvent = this.events[this.events.length - 1];
		if (lastEvent) return new SvelteDate(lastEvent.timestamp).getTime();
		return (this.actualStart ?? this.scheduledStart).getTime();
	}

	public getLastEventGameTime(): number {
		const lastEvent = this.events[this.events.length - 1];
		return lastEvent ? lastEvent.gameTime : 0;
	}
}
