import { getGame } from '$lib/server/game.js';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { game } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params, cookies }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(404, 'Invalid game id');

	const authorizedGameCode = cookies.get(`game_${gameId}_code`);

	// Everyone must have entered the correct code
	const gameRecord = await db.select().from(game).where(eq(game.id, gameId)).limit(1);

	if (!gameRecord[0] || gameRecord[0].code !== authorizedGameCode) {
		throw redirect(302, '/scorekeeper');
	}

	const gameData = await getGame(gameId);
	if (!gameData) throw error(404, 'Game not found');

	return {
		gameData
	};
};
