import { db } from '$lib/server/db/client';
import { game } from '$lib/server/db/schema';
import { and, asc, eq, lt } from 'drizzle-orm';

export const load = async () => {
	// Games kicking off within the next 12 hours that have not been started yet. Status stays
	// 'scheduled' until someone starts scorekeeping, so this also picks up past-due games that
	// were never started.
	const games = await db.query.game.findMany({
		with: {
			homeTeam: true,
			awayTeam: true
		},
		where: and(
			eq(game.status, 'scheduled'),
			lt(game.scheduledStart, new Date(Date.now() + 22 * 60 * 60 * 1000))
		),
		orderBy: asc(game.scheduledStart)
	});

	return { games };
};
