import { db } from '$lib/server/db/client';
import { player, team, tournament } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import type { Actions } from './$types';

const isValidHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);
const isValidAcronym = (acronym: string): boolean => /^[A-Z]{3,4}$/.test(acronym);

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
		const teamName = data.get('teamName');
		const teamColor = data.get('teamColor');
		const teamAcronym = data.get('teamAcronym');

		if (!teamName || !teamColor || !teamAcronym) {
			throw error(400, 'Missing required fields');
		}

		const colorStr = teamColor.toString();
		if (!isValidHexColor(colorStr)) {
			throw error(400, 'Invalid color format');
		}

		const acronymStr = teamAcronym.toString().toUpperCase();
		if (!isValidAcronym(acronymStr)) {
			throw error(400, 'Acronym must be 3-4 uppercase letters');
		}

		const tId = Number(params.tournamentId);
		await db.insert(team).values({
			name: teamName.toString(),
			acronym: acronymStr,
			color: colorStr,
			tournament: tId
		});
	},
	updateTeamColor: async ({ params, request }) => {
		const data = await request.formData();
		const teamIdData = data.get('teamId');
		const teamColor = data.get('teamColor');

		if (!teamIdData || !teamColor) {
			throw error(400, 'Missing required fields');
		}

		const colorStr = teamColor.toString();
		if (!isValidHexColor(colorStr)) {
			throw error(400, 'Invalid color format');
		}

		const teamId = Number(teamIdData);
		const tId = Number(params.tournamentId);
		await db
			.update(team)
			.set({ color: colorStr })
			.where(and(eq(team.id, teamId), eq(team.tournament, tId)));
	},
	deleteTeam: async ({ params, request }) => {
		const data = await request.formData();
		const teamId: number = Number(data.get('team'));
		const tId: number = Number(params.tournamentId);
		await db.delete(team).where(and(eq(team.id, teamId), eq(team.tournament, tId)));
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
	},
	updateTeamAcronym: async ({ params, request }) => {
		const data = await request.formData();
		const teamIdData = data.get('teamId');
		const teamAcronym = data.get('teamAcronym');

		if (!teamIdData || !teamAcronym) {
			throw error(400, 'Missing required fields');
		}

		const acronymStr = teamAcronym.toString().toUpperCase();
		if (!isValidAcronym(acronymStr)) {
			throw error(400, 'Acronym must be 3-4 uppercase letters');
		}

		const teamId = Number(teamIdData);
		const tId = Number(params.tournamentId);
		await db
			.update(team)
			.set({ acronym: acronymStr })
			.where(and(eq(team.id, teamId), eq(team.tournament, tId)));
	}
} satisfies Actions;
