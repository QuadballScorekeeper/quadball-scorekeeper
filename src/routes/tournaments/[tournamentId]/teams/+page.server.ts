import { db } from '$lib/server/db/client';
import { team } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const tId = Number(params.tournamentId);
	if (Number.isNaN(tId)) throw error(400, 'Invalid tournament id');

	const teams = await db
		.select()
		.from(team)
		.where(eq(team.tournament, tId))
		.orderBy(desc(team.name));

	return { teams };
};
