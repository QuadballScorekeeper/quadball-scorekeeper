import { db } from '$lib/server/db/client';
import { game, gameEvent } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid tournament id');

	const gameInfo = await db.query.game.findFirst({
		where: eq(game.id, gameId),
		with: {
			homeTeam: {
				with: {
					players: true
				}
			},
			awayTeam: {
				with: {
					players: true
				}
			},
			events: {
				orderBy: asc(gameEvent.eventNum)
			}
		}
	});
	if (gameInfo == undefined) throw error(400, 'unable to find game');

	return {
		gameInfo
	};
};
