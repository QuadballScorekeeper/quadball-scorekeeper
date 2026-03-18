import { db } from '$lib/server/db/client';
import { game } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid game id');

	const gameInfo = await db.query.game.findFirst({
		where: eq(game.id, gameId),
		with: {
			homeTeam: true,
			awayTeam: true,
			events: true
		}
	});

	if (gameInfo == undefined) throw error(404, 'Game not found');

	return {
		gameInfo
	};
};
