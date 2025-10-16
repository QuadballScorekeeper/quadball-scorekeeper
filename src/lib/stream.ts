import type { GameEvent } from './models/GameEvent.svelte';

const streamConnections = new Map<number, Set<ReadableStreamDefaultController>>();

export function addGameViewer(gameId: number, stream: ReadableStreamDefaultController) {
	if (!streamConnections.has(gameId)) streamConnections.set(gameId, new Set());
	streamConnections.get(gameId)!.add(stream);
}

export function broadcastGameEvent(event: GameEvent) {
	console.log('sending', event.eventType, 'event to all connections!');
	const streams = streamConnections.get(event.game);
	if (!streams) return;

	const eventData = JSON.stringify(event)

	streams.forEach((stream) => {
		try {
			console.log('sending', event.eventType, 'event to single stream');
			stream.enqueue(`data: ${eventData}\n\n`);
		} catch (error) {
			console.error('Could not enqueue to stream, removing it?');
			streams.delete(stream);
		}
	});
}
