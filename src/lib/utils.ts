export function formatGameTime(milliseconds: number) {
	const zeroPad = (n: number) => n.toString().padStart(2, '0');
	const seconds = zeroPad(Math.floor(milliseconds / 1000) % 60);
	const minutes = zeroPad(Math.floor(milliseconds / 1000 / 60));
	return `${minutes}:${seconds}`;
}

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
