import { db } from '$lib/server/db/client';
import { game, team, tournament } from '$lib/server/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { generateUniqueGameCode } from '$lib/server/gameCode';

export const load = async ({ params }) => {
	const tId = Number(params.tournamentId);
	const t = await db.query.tournament.findFirst({
		where: eq(tournament.id, tId)
	});
	if (!t) throw error(404, 'Tournament not found');
	const teams = await db.query.team.findMany({
		where: eq(team.tournament, tId),
		orderBy: asc(team.name)
	});
	const games = await db.query.game.findMany({
		with: {
			homeTeam: true,
			awayTeam: true
		},
		where: eq(game.tournament, tId),
		orderBy: asc(game.start)
	});

	return { teams, games, tournament: t };
};

export const actions = {
	newGame: async ({
		params,
		request,
		locals
	}): Promise<{ success: true; code: string } | ReturnType<typeof fail<{ error: string }>>> => {
		// Auth check
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(401, { error: 'Unauthorized' });
		}

		const tId: number = Number(params.tournamentId);
		const data = await request.formData();
		const homeTeam: number = Number(data.get('homeTeam'));
		const awayTeam: number = Number(data.get('awayTeam'));

		// Validation
		if (homeTeam === awayTeam) {
			return fail(400, { error: 'Home and away teams must be different' });
		}

		const start: Date = new Date(data.get('start')!.toString());

		try {
			// Generate unique game code
			const code = await generateUniqueGameCode(db);

			await db.insert(game).values({
				start: start,
				homeTeamId: homeTeam,
				awayTeamId: awayTeam,
				tournament: tId,
				code
			});

			return { success: true, code };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to create game' });
		}
	},
	deleteGame: async ({
		params,
		request,
		locals
	}): Promise<{ success: true } | ReturnType<typeof fail<{ error: string }>>> => {
		// Auth check
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(401, { error: 'Unauthorized' });
		}

		const data = await request.formData();
		const gameId: number = Number(data.get('game'));
		const tId: number = Number(params.tournamentId);

		try {
			await db.delete(game).where(and(eq(game.id, gameId), eq(game.tournament, tId)));
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to delete game' });
		}
	}
} satisfies Actions;
