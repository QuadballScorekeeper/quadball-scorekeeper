import { get, writable, type Unsubscriber } from 'svelte/store';
import { time } from './stores';

export class Timer {
	private _duration = writable(0);
	private _previousDuration = 0;
	private _unsubscribe: Unsubscriber | undefined;

	get duration() {
		return this._duration;
	}

	start() {
		if (!this._unsubscribe) {
			this._unsubscribe = time.subscribe((value) =>
				this._duration.set(value + this._previousDuration)
			);
			return true;
		}
		return false;
	}

	stop() {
		if (this._unsubscribe) {
			this._previousDuration = get(time);
			this._unsubscribe();
			this._unsubscribe = undefined;
			return true;
		}
		return false;
	}
}
