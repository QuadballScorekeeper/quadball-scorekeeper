import { db } from '$lib/server/db/client';
import { game } from '$lib/server/db/schema';
import { and, asc, eq, lt } from 'drizzle-orm';

export const load = async () => {

    const gamesWithTeams = await db.query.game.findMany({
        with: {
            homeTeam: true,
            awayTeam: true,
        },
        where: and(
            eq(game.status, "scheduled"),
            lt(game.start, new Date(Date.now() + 12 * 60 * 60 * 1000))),
        orderBy: asc(game.start),
    })

    return { games: gamesWithTeams };
};
