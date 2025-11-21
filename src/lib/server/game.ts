import { db } from '$lib/server/db/client';
import { game } from '$lib/server/db/schema';
import { eq, type InferInsertModel } from 'drizzle-orm';

export async function getGame(gameId: number) {
	return db.query.game.findFirst({
		with: {
			homeTeam: { with: { players: true } },
			awayTeam: { with: { players: true } },
			events: true
		},
		where: eq(game.id, gameId)
	});
}

export function addGame(gameData: InferInsertModel<typeof game>) {
	return db.insert(game).values(gameData).returning();
}

export function updateGame(gameData: InferInsertModel<typeof game>) {
	if (!gameData.id) throw Error('Missing game ID');
	return db.update(game).set(gameData).where(eq(game.id, gameData.id));
}
