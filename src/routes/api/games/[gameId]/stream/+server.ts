import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { addGameViewer } from '$lib/stream';

export const GET: RequestHandler = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid game id');

	const stream = new ReadableStream({
		start(controller) {
			addGameViewer(gameId, controller);
		},
		cancel() {}
	});
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache'
		}
	});
};
