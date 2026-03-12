import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { addGameViewer, removeGameViewer } from '$lib/stream';

export const GET: RequestHandler = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid game id');

	let pingInterval: ReturnType<typeof setInterval> | null = null;

	const stream = new ReadableStream({
		start(controller) {
			addGameViewer(gameId, controller);

			// Send initial connection confirmation with retry interval
			controller.enqueue('retry: 5000\nevent: connected\ndata: {"status":"connected"}\n\n');

			pingInterval = setInterval(() => {
				try {
					controller.enqueue(': ping\n\n');
				} catch {
					console.log(`Ping failed for game ${gameId}, cleaning up connection`);
					removeGameViewer(gameId, controller);
					if (pingInterval) clearInterval(pingInterval);
				}
			}, 15_000); // Increased to 15 seconds
		},
		cancel(controller) {
			// Clean up when client disconnects
			if (pingInterval) {
				clearInterval(pingInterval);
				pingInterval = null;
			}
			removeGameViewer(gameId, controller);
			console.log(`Client disconnected from game ${gameId} stream`);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-store',
			'Connection': 'keep-alive',
			'X-Accel-Buffering': 'no' // Disable proxy buffering (nginx)
		}
	});
};
