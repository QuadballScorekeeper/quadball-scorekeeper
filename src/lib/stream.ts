import type { GameEvent } from './client/GameEvent.svelte';

const streamConnections = new Map<number, Set<ReadableStreamDefaultController>>();

export function addGameViewer(gameId: number, stream: ReadableStreamDefaultController) {
	if (!streamConnections.has(gameId)) streamConnections.set(gameId, new Set());
	streamConnections.get(gameId)!.add(stream);
}
export function removeGameViewer(gameId: number, stream: ReadableStreamDefaultController) {
	if (!streamConnections.has(gameId)) return;
	streamConnections.get(gameId)!.delete(stream);
}

export function broadcastGameEvent(event: GameEvent) {
	const streams = streamConnections.get(event.game);
	if (!streams) return;
	console.log('sending', event.eventType, 'event to all connections!');

	const eventData = JSON.stringify(event);

	streams.forEach((stream) => {
		try {
			console.log('sending', event.eventType, 'event to single stream');
			stream.enqueue(`data: ${eventData}\n\n`);
		} catch (error) {
			console.error('Could not enqueue to stream, got error: ', error);
			streams.delete(stream);
		}
	});
}
