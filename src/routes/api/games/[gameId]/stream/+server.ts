import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { addGameViewer, removeGameViewer } from '$lib/stream';

export const GET: RequestHandler = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid game id');

	const stream = new ReadableStream({
		start(controller) {
			addGameViewer(gameId, controller);
			const interval = setInterval(() => {
				try {
					controller.enqueue('event: ping\n\n');
				} catch {
					removeGameViewer(gameId, controller);
					clearInterval(interval);
				}
			}, 3_000);
		}
	});
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-store',
			Connection: 'keep-alive'
		}
	});
};
