import { get, writable } from 'svelte/store';
import { Timer } from './timer';

export class Game {
	private readonly _goal = 10;
	private _timer = new Timer();
	private _scoreA = writable(0);
	private _scoreB = writable(0);
	private _started = writable(false);
	private _paused = writable(false);

	get duration() {
		return this._timer.duration;
	}

	get scoreA() {
		return this._scoreA;
	}

	get scoreB() {
		return this._scoreB;
	}

	get started() {
		return this._started;
	}

	get paused() {
		return this._paused;
	}

	start() {
		if (get(this._started)) {
			//throw error
		}

		console.log('starting game');
		this._timer.start();
		this._started.set(true);
		//Create GameStartedEvent
	}

	pause() {
		if (!this._timer.stop()) {
			//throw error
		}

		console.log('pausing game');
		this._timer.stop();
		this._paused.set(true);
		//Create GamePausedEvent
	}

	resume() {
		if (get(this._started)) {
			//throw error
		}

		console.log('resuming game');
		this._timer.start();
		this._paused.set(false);
		//Create GameResumedEvent
	}

	scoreGoal(team: Team) {
		console.log('scoring goal');
		if (team === 'A') {
			this._scoreA.update((n) => n + this._goal);
		} else {
			this._scoreB.update((n) => n + this._goal);
		}

		//Create GoalScoredEvent
	}

	annulGoal(team: Team) {
		console.log('annuling goal');
		if (team === 'A') {
			this._scoreA.update((n) => n && n - this._goal);
		} else {
			this._scoreB.update((n) => n && n - this._goal);
		}

		//Create GoalAnnuledEvent
	}
}

export type Team = 'A' | 'B';
