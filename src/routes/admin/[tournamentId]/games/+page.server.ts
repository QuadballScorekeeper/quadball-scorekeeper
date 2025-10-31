import { db } from '$lib/server/db/client';
import { game, player, team, tournament } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const tId = Number(params.tournamentId);
    const t = await db.query.tournament.findFirst({
        where: eq(tournament.id, tId)
    })
    if (!t) throw error(404, 'Tournament not found')
    const teams = await db.query.team.findMany({
        where: eq(team.tournament, tId),
        orderBy: asc(team.name),
    })
    const games = await db.query.game.findMany({
        with: {
            homeTeam: true,
            awayTeam: true,
        },
        where: eq(game.tournament, tId),
        orderBy: asc(game.start)
    })

    return { teams, games, tournament: t };
};

export const actions = {
    newGame: async ({ params, request }) => {
        const data = await request.formData();
        const homeTeam: number = Number(data.get("homeTeam"));
        const awayTeam: number = Number(data.get("awayTeam"));
        const start: Date = new Date(Number(data.get("start")));
        const tId = Number(params.tournamentId);
        await db
            .insert(game)
            .values({
                start: start,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                tournament: tId,
            })
    },
} satisfies Actions;