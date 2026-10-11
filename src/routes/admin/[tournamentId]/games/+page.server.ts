import { db } from '$lib/server/db/client';
import { game, team, tournament } from '$lib/server/db/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const tId = Number(params.tournamentId);
	const t = await db.query.tournament.findFirst({
		where: eq(tournament.id, tId)
	});
	if (!t) throw error(404, 'Tournament not found');
	const teams = await db.query.team.findMany({
		where: eq(team.tournamentId, tId),
		orderBy: asc(team.name)
	});
	const games = await db.query.game.findMany({
		with: {
			homeTeam: true,
			awayTeam: true
		},
		where: eq(game.tournamentId, tId),
		orderBy: asc(game.scheduledStart)
	});

	return { teams, games, tournament: t };
};

export const actions = {
	newGame: async ({
		params,
		request
	}): Promise<{ success: string } | ReturnType<typeof fail<{ error: string }>>> => {
		const tId: number = Number(params.tournamentId);
		const data = await request.formData();
		const homeTeam: number = Number(data.get('homeTeam'));
		const awayTeam: number = Number(data.get('awayTeam'));

		// Validation
		if (homeTeam === awayTeam) {
			return fail(400, { error: 'Home and away teams must be different' });
		}

		const start = new Date(data.get('start')!.toString());
		if (Number.isNaN(start.getTime())) {
			return fail(400, { error: 'Invalid start time' });
		}

		const teamsInTournament = await db
			.select({ id: team.id })
			.from(team)
			.where(and(eq(team.tournamentId, tId), inArray(team.id, [homeTeam, awayTeam])));
		if (teamsInTournament.length !== 2) {
			return fail(400, { error: 'Both teams must belong to this tournament' });
		}

		try {
			await db.insert(game).values({
				scheduledStart: start,
				homeTeamId: homeTeam,
				awayTeamId: awayTeam,
				tournamentId: tId
			});

			return { success: 'Game created' };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to create game' });
		}
	},
	updateGameStart: async ({
		params,
		request
	}): Promise<{ success: string } | ReturnType<typeof fail<{ error: string }>>> => {
		const tId: number = Number(params.tournamentId);
		const data = await request.formData();
		const gameId: number = Number(data.get('game'));

		const start = new Date(data.get('start')!.toString());
		if (Number.isNaN(gameId) || Number.isNaN(start.getTime())) {
			return fail(400, { error: 'Invalid game or start time' });
		}

		try {
			const updated = await db
				.update(game)
				.set({ scheduledStart: start })
				.where(and(eq(game.id, gameId), eq(game.tournamentId, tId)))
				.returning({ id: game.id });
			if (updated.length === 0) {
				return fail(404, { error: 'Game not found' });
			}
			return { success: 'Start time updated' };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to update game' });
		}
	},
	deleteGame: async ({
		params,
		request
	}): Promise<{ success: string } | ReturnType<typeof fail<{ error: string }>>> => {
		const data = await request.formData();
		const gameId: number = Number(data.get('game'));
		const tId: number = Number(params.tournamentId);

		try {
			await db.delete(game).where(and(eq(game.id, gameId), eq(game.tournamentId, tId)));
			return { success: 'Game deleted' };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to delete game' });
		}
	}
} satisfies Actions;
