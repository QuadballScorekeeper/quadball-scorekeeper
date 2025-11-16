export type PenaltyType = 'blue_card' | 'yellow_card' | 'red_card' | 'ejection';
export const PENALTIES: PenaltyType[] = ['blue_card', 'yellow_card', 'red_card', 'ejection'];

export class Penalty {
	type: PenaltyType;
	team: number;
	player: number;
	timeLeft: number;
	active: boolean;

	constructor(type: PenaltyType, team: number, player: number) {
		this.type = type;
		this.team = team;
		this.player = player;
		this.timeLeft = $state(0);
		switch (type) {
			case 'blue_card':
			case 'yellow_card':
				this.timeLeft = 60 * 1000;
				break;
			case 'red_card':
				this.timeLeft = 2 * 60 * 1000;
				break;
			case 'ejection':
				break;
		}
		this.active = $derived(this.timeLeft ? this.timeLeft > 0 : false);
	}

	public removeTime(time: number) {
		this.timeLeft = Math.max(this.timeLeft - time, 0);
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
