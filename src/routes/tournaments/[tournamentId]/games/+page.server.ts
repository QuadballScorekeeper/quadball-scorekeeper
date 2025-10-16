import { db } from '$lib/server/db/client';
import { game, team } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const load = async ({ params }) => {
	const tournamentId = Number(params.tournamentId);
	if (Number.isNaN(tournamentId)) throw error(400, 'Invalid tournament id');
	// Handle tournament id not existing in db?

	const homeTeam = alias(team, 'homeTeam');
	const away = alias(team, 'awayTeam');
	const gamesWithTeams = await db
		.select()
		.from(game)
		.where(eq(game.tournament, tournamentId))
		.innerJoin(homeTeam, eq(game.homeTeam, homeTeam.id))
		.innerJoin(away, eq(game.awayTeam, away.id))
		.orderBy(asc(game.start));

	return { games: gamesWithTeams };
};
