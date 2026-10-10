import { db } from '$lib/server/db/client';
import { game, gameEvent } from '$lib/server/db/schema';
import { and, asc, eq, lt, notExists } from 'drizzle-orm';

export const load = async () => {
	// Games kicking off within the next 12 hours that have not been started yet. A game is
	// started once it has a 'start' event, so this also picks up past-due games that were never
	// started.
	const games = await db.query.game.findMany({
		with: {
			homeTeam: true,
			awayTeam: true
		},
		where: and(
			notExists(
				db
					.select()
					.from(gameEvent)
					.where(and(eq(gameEvent.gameId, game.id), eq(gameEvent.eventType, 'start')))
			),
			lt(game.scheduledStart, new Date(Date.now() + 22 * 60 * 60 * 1000))
		),
		orderBy: asc(game.scheduledStart)
	});

	return { games };
};
