import { db } from '$lib/server/db/client';
import { player } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const teamId = Number(params.teamId);

	if (Number.isNaN(teamId)) throw error(400, 'Invalid tournament id');

	const players = await db.query.player.findMany({
		where: eq(player.team, teamId),
		orderBy: asc(player.number)
	})

	return {
		players
	};
};
