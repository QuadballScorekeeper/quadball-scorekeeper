import { writable } from 'svelte/store';

export class Game {
	scoreA = writable(0);
	scoreB = writable(0);
	duration = writable(0);
	started = writable(false);
	paused = writable(false);
}
