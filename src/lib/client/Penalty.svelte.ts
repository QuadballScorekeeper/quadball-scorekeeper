export type PenaltyType = 'blue_card' | 'yellow_card' | 'red_card' | 'ejection';
export const PENALTIES: PenaltyType[] = ['blue_card', 'yellow_card', 'red_card', 'ejection'];

export class Penalty {
	type: PenaltyType;
	team: number;
	player: number;
	timeLeft: number;
	active: boolean;
	gameTimeWhenCreated: number;
	initialDuration: number;

	constructor(type: PenaltyType, team: number, player: number, gameTimeWhenCreated: number = 0) {
		this.type = type;
		this.team = team;
		this.player = player;
		this.gameTimeWhenCreated = gameTimeWhenCreated;

		// Set initial duration based on penalty type
		let duration = 0;
		switch (type) {
			case 'blue_card':
			case 'yellow_card':
				duration = 60 * 1000;
				break;
			case 'red_card':
				duration = 2 * 60 * 1000;
				break;
			case 'ejection':
				duration = 0;
				break;
		}
		this.initialDuration = duration;
		this.timeLeft = $state(duration);
		this.active = $derived(this.timeLeft ? this.timeLeft > 0 : false);
	}

	public removeTime(time: number) {
		this.timeLeft = Math.max(this.timeLeft - time, 0);
	}

	public calculateTimeLeft(currentGameTime: number): number {
		if (this.initialDuration === 0) return 0; // Ejection
		const elapsed = currentGameTime - this.gameTimeWhenCreated;
		return Math.max(this.initialDuration - elapsed, 0);
	}

	public release() {
		this.timeLeft = 0;
	}

	public getIcon() {
		switch (this.type) {
			case 'blue_card':
				return '🟦';
			case 'yellow_card':
				return '🟨';
			case 'red_card':
				return '🟥';
			case 'ejection':
				return '🚫';
			default:
				return this.type;
		}
	}
}
