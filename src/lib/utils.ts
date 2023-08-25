export function formatTime(milliseconds: number) {
	const ss = Math.floor(milliseconds / 1000) % 60;
	const mm = Math.floor(milliseconds / 1000 / 60);

	return `${mm}:${ss}`;
}
