export function formatGameTime(milliseconds: number) {
	const zeroPad = (n: number) => n.toString().padStart(2, '0');
	const seconds = zeroPad(Math.floor(milliseconds / 1000) % 60);
	const minutes = zeroPad(Math.floor(milliseconds / 1000 / 60));
	return `${minutes}:${seconds}`;
}

// TODO: make this display dates differently depending on how far away they are in the past/future
export function formatDate(date: Date): string {
	return date.toLocaleDateString([], { month: 'short', day: 'numeric' }); // "Oct 10"
}

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
