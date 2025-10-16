import { db } from '$lib/server/db/client';
import { tournament } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const tournamentId = Number(params.tournamentId);
	if (Number.isNaN(tournamentId)) throw error(400, 'Invalid tournament id');

	const t = await db.select().from(tournament).where(eq(tournament.id, tournamentId)).limit(1);

	if (t.length === 0) throw error(404, 'Tournament not found');

	return { tournament: t[0] };
};
