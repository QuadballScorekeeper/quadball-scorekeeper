import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/client';
import { game } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Game } from '$lib/client/Game.svelte';

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	const gameId = Number(params.gameId);

	// Check authorization via game code
	const authorizedGameCode = cookies.get(`game_${gameId}_code`);

	if (!authorizedGameCode) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Verify code matches game
	const gameData = await db.select().from(game).where(eq(game.id, gameId)).limit(1);
	if (!gameData[0] || gameData[0].code !== authorizedGameCode) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let { start, status }: { start: Game['start']; status: Game['status'] } = await request.json();

	start = new Date(start);
	try {
		await db
			.update(game)
			.set({
				start: start,
				status: status
			})
			.where(eq(game.id, gameId));
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error updating game' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
};
