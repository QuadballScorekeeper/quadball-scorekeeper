import { db } from '$lib/server/db/client';
import { game, gameEvent, team } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const load = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid tournament id');

	const homeTeam = alias(team, 'homeTeam');
	const away = alias(team, 'awayTeam');
	const gameWithTeams = await db
		.select()
		.from(game)
		.where(eq(game.id, gameId))
		.innerJoin(homeTeam, eq(game.homeTeam, homeTeam.id))
		.innerJoin(away, eq(game.awayTeam, away.id))
		.limit(1);

	if (gameWithTeams.length == 0) throw error(404, 'Game not found');

	const gameEvents = await db
		.select()
		.from(gameEvent)
		.where(eq(gameEvent.game, gameId))
		.orderBy(desc(gameEvent.timestamp));

	return {
		gameWithTeams,
		gameEvents
	};
};
