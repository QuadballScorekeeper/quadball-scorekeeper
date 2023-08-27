function zeroPad(n: number) {
	return n >= 10 ? n.toString() : `0${n}`;
}

export function formatTime(milliseconds: number) {
	const ss = zeroPad(Math.floor(milliseconds / 1000) % 60);
	const mm = zeroPad(Math.floor(milliseconds / 1000 / 60));

	return `${mm}:${ss}`;
}

export const isOvertime = (scoreCatchingTeam: number, scoreOtherTeam: number): boolean =>
	scoreCatchingTeam <= scoreOtherTeam;
