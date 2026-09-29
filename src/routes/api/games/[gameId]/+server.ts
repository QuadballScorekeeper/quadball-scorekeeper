import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/client';
import { game, gameStatusEnum, type SelectGame } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { authorizeGame } from '$lib/server/game';

function isPersistedStatus(value: unknown): value is SelectGame['status'] {
	return gameStatusEnum.enumValues.includes(value as SelectGame['status']);
}

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	const gameId = Number(params.gameId);

	if (!(await authorizeGame(gameId, cookies))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { status }: { status: unknown } = await request.json();

	// 'paused' and 'timeout' are transient client state, derived from the event log
	if (!isPersistedStatus(status)) {
		return json({ success: false, error: 'Invalid game status' }, { status: 400 });
	}

	try {
		await db.update(game).set({ status }).where(eq(game.id, gameId));
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error updating game' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
};
