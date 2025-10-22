import { db } from '$lib/server/db/client';
import { game, gameEvent, team } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, asc, eq, } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const load = async ({ params }) => {
	const tournamentId = Number(params.tournamentId);
	if (Number.isNaN(tournamentId)) throw error(400, 'Invalid tournament id');
	// Handle tournament id not existing in db?

	const home = alias(team, 'homeTeam');
	const away = alias(team, 'awayTeam');
	const gamesWithTeams = await db
		.select({
			id: game.id,
			home: home.name,
			away: away.name,
			status: game.status,
			start: game.start,
			homeGoals: db.$count(gameEvent, and(eq(gameEvent.game, game.id), eq(gameEvent.team, home.id), eq(gameEvent.eventType, "goal"))),
			awayGoals: db.$count(gameEvent, and(eq(gameEvent.game, game.id), eq(gameEvent.team, away.id), eq(gameEvent.eventType, "goal"))),
			homeCatch: db.$count(gameEvent, and(eq(gameEvent.game, game.id), eq(gameEvent.team, home.id), eq(gameEvent.eventType, "catch"))),
			awayCatch: db.$count(gameEvent, and(eq(gameEvent.game, game.id), eq(gameEvent.team, away.id), eq(gameEvent.eventType, "catch"))),
		})
		.from(game)
		.where(eq(game.tournament, tournamentId))
		.innerJoin(home, eq(game.homeTeam, home.id))
		.innerJoin(away, eq(game.awayTeam, away.id))
		.orderBy(asc(game.start));

	console.log(gamesWithTeams)

	return { games: gamesWithTeams };
};
