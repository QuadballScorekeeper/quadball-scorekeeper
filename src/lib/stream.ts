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

function broadcast(gameId: number, message: string) {
	const streams = streamConnections.get(gameId);
	if (!streams) return;

	streams.forEach((stream) => {
		try {
			stream.enqueue(message);
		} catch (error) {
			console.error('Could not enqueue to stream, got error: ', error);
			streams.delete(stream);
		}
	});
}

export function broadcastGameEvent(event: GameEvent) {
	console.log('sending', event.eventType, 'event to all connections!');
	broadcast(event.gameId, `data: ${JSON.stringify(event)}\n\n`);
}

/**
 * Tell a game's viewers that the event log changed (an event was edited or removed), so they
 * refetch it and rebuild their state. Sent as a named SSE event, so it doesn't interfere
 * with the default 'message' events.
 */
export function broadcastEventsChanged(gameId: number) {
	console.log('sending events-changed notification to all connections!');
	broadcast(gameId, `event: events-changed\ndata: {}\n\n`);
}
