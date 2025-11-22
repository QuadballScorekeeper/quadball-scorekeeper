import { db } from '$lib/server/db/client';
import { player, team, tournament } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions } from './$types';

export const load = async ({ params }) => {
	const tId = Number(params.tournamentId);

	const tournamentData = await db.select().from(tournament).where(eq(tournament.id, tId)).limit(1);

	const teamsWithPlayers = await db.query.team.findMany({
		where: eq(team.tournament, tId),
		with: {
			players: {
				orderBy: desc(player.number)
			}
		}
	});

	if (tournamentData.length === 0) throw error(404, 'Tournament not found');

	return { teamsWithPlayers, tournament: tournamentData[0] };
};

export const actions = {
	newTeam: async ({ params, request }) => {
		const data = await request.formData();
		const teamName: string = data.get('teamName')!.toString();
		const tId = Number(params.tournamentId);
		await db.insert(team).values({
			name: teamName,
			tournament: tId
		});
	},
	newPlayer: async ({ request }) => {
		const data = await request.formData();
		const playerName: string = data.get('playerName')!.toString();
		const playerNumber: number = Number(data.get('playerNumber'));
		const teamId: number = Number(data.get('teamId'));

		await db.insert(player).values({
			name: playerName,
			number: playerNumber,
			team: teamId
		});
	}
} satisfies Actions;
