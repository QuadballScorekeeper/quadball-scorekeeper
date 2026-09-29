import { db } from '$lib/server/db/client';
import { tournament } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export const load = async ({ params }) => {
	const tournamentId = Number(params.tournamentId);
	if (Number.isNaN(tournamentId)) throw error(400, 'Invalid tournament id');

	const t = await db.query.tournament.findFirst({
		where: eq(tournament.id, tournamentId)
	});
	if (!t) throw error(404, 'Tournament not found');

	return { tournament: t };
};

export const actions = {
	saveTournament: async ({ params, request }) => {
		const tId = Number(params.tournamentId);
		const data = await request.formData();
		await db
			.update(tournament)
			.set({
				name: data.get('name')!.toString(),
				start: new Date(data.get('start')!.toString()),
				end: new Date(data.get('end')!.toString())
			})
			.where(eq(tournament.id, tId));
	},
	deleteTournament: async ({ params }) => {
		const tId = Number(params.tournamentId);
		console.log('Deleting team', tId);
		await db.delete(tournament).where(eq(tournament.id, tId));
	}
} satisfies Actions;
