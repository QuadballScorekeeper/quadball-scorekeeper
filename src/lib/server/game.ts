import { db } from '$lib/server/db/client';
import { game, gameEvent } from '$lib/server/db/schema';
import { asc, eq, type InferInsertModel } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';

export async function getGame(gameId: number) {
	return db.query.game.findFirst({
		with: {
			homeTeam: { with: { players: true } },
			awayTeam: { with: { players: true } },
			// Replaying events to rebuild game state only works in order
			events: { orderBy: asc(gameEvent.eventNum) }
		},
		where: eq(game.id, gameId)
	});
}

/**
 * A scorekeeper is authorized for a game if they have previously entered its code, which is
 * stored per game in a cookie by /api/games/code/[code].
 * Returns the game row when the cookie matches, otherwise null.
 */
export async function authorizeGame(gameId: number, cookies: Cookies) {
	const authorizedGameCode = cookies.get(`game_${gameId}_code`);
	if (!authorizedGameCode) return null;

	const gameRecord = await db.select().from(game).where(eq(game.id, gameId)).limit(1);
	if (!gameRecord[0] || gameRecord[0].code !== authorizedGameCode) return null;

	return gameRecord[0];
}

export function addGame(gameData: InferInsertModel<typeof game>) {
	return db.insert(game).values(gameData).returning();
}

export function updateGame(gameData: InferInsertModel<typeof game>) {
	if (!gameData.id) throw Error('Missing game ID');
	return db.update(game).set(gameData).where(eq(game.id, gameData.id));
}
