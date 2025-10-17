import { db } from '$lib/server/db/client';
import { game, team } from '$lib/server/db/schema';
import { and, asc, eq, lt } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const load = async () => {

    const homeTeam = alias(team, 'homeTeam');
    const away = alias(team, 'awayTeam');
    const gamesWithTeams = await db
        .select()
        .from(game)
        .where(and(eq(game.status, "scheduled"), lt(game.start, new Date(Date.now() + 12 * 60 * 60 * 1000))))
        .innerJoin(homeTeam, eq(game.homeTeam, homeTeam.id))
        .innerJoin(away, eq(game.awayTeam, away.id))
        .orderBy(asc(game.start));

    return { games: gamesWithTeams };
};
