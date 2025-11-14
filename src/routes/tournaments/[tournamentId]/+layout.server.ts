import { error } from '@sveltejs/kit';
import { getTournament } from '$lib/server/tournament';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const tournamentId = Number(params.tournamentId);
	if (Number.isNaN(tournamentId)) throw error(400, 'Invalid tournament id');

	const tournamentData = await getTournament(tournamentId);
	if (!tournamentData) throw error(404, 'Tournament not found');

	return { tournamentData };
};
