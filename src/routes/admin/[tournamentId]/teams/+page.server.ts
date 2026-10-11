import { db } from '$lib/server/db/client';
import { game, player, team, tournament } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, asc, eq, inArray, or } from 'drizzle-orm';
import type { Actions } from './$types';

const isValidHexColor = (color: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(color);

// Postgres unique-constraint violations surface either directly or as the `cause`
// of a drizzle error, depending on the driver.
function isUniqueViolation(e: unknown): boolean {
	let current: unknown = e;
	while (typeof current === 'object' && current !== null) {
		if ('code' in current && (current as { code?: unknown }).code === '23505') return true;
		current = (current as { cause?: unknown }).cause;
	}
	return false;
}

export const load = async ({ params }) => {
	const tId = Number(params.tournamentId);

	const tournamentData = await db.select().from(tournament).where(eq(tournament.id, tId)).limit(1);

	if (tournamentData.length === 0) throw error(404, 'Tournament not found');

	const teamsWithPlayers = await db.query.team.findMany({
		where: eq(team.tournamentId, tId),
		with: {
			players: {
				orderBy: asc(player.number)
			}
		},
		orderBy: asc(team.name)
	});

	return { teamsWithPlayers, tournament: tournamentData[0] };
};

// Restricts player mutations to players on teams of this tournament.
const teamsOfTournament = (tId: number) =>
	db.select({ id: team.id }).from(team).where(eq(team.tournamentId, tId));

export const actions = {
	newTeam: async ({ params, request }) => {
		const tId = Number(params.tournamentId);
		const data = await request.formData();
		const teamName = data.get('teamName');
		const teamColor = data.get('teamColor');
		const teamAcronym = data.get('teamAcronym');

		if (!teamName || !teamColor || !teamAcronym) {
			return fail(400, { error: 'Missing required fields' });
		}

		const nameStr = teamName.toString().trim();
		if (!nameStr) {
			return fail(400, { error: 'Team name cannot be empty' });
		}

		const colorStr = teamColor.toString();
		if (!isValidHexColor(colorStr)) {
			return fail(400, { error: 'Invalid color format' });
		}

		const acronymStr = teamAcronym.toString().trim().toUpperCase();
		if (!acronymStr) {
			return fail(400, { error: 'Acronym cannot be empty' });
		}

		try {
			await db.insert(team).values({
				name: nameStr,
				acronym: acronymStr,
				color: colorStr,
				tournamentId: tId
			});
			return { success: 'Team added' };
		} catch (e) {
			if (isUniqueViolation(e)) {
				return fail(400, {
					error: 'A team with that name or acronym already exists in this tournament'
				});
			}
			console.error(e);
			return fail(500, { error: 'Failed to create team' });
		}
	},
	updateTeamColor: async ({ params, request }) => {
		const data = await request.formData();
		const teamIdData = data.get('teamId');
		const teamColor = data.get('teamColor');

		if (!teamIdData || !teamColor) {
			return fail(400, { error: 'Missing required fields' });
		}

		const colorStr = teamColor.toString();
		if (!isValidHexColor(colorStr)) {
			return fail(400, { error: 'Invalid color format' });
		}

		const teamId = Number(teamIdData);
		const tId = Number(params.tournamentId);
		await db
			.update(team)
			.set({ color: colorStr })
			.where(and(eq(team.id, teamId), eq(team.tournamentId, tId)));
	},
	updateTeam: async ({ params, request }) => {
		const tId = Number(params.tournamentId);
		const data = await request.formData();
		const teamIdData = data.get('teamId');
		const teamName = data.get('teamName')?.toString().trim() ?? '';
		const teamAcronym = data.get('teamAcronym')?.toString().trim().toUpperCase() ?? '';

		if (!teamIdData) {
			return fail(400, { error: 'Missing required fields' });
		}
		if (!teamName) {
			return fail(400, { error: 'Team name cannot be empty' });
		}
		if (!teamAcronym) {
			return fail(400, { error: 'Acronym cannot be empty' });
		}

		const teamId = Number(teamIdData);
		try {
			const updated = await db
				.update(team)
				.set({ name: teamName, acronym: teamAcronym })
				.where(and(eq(team.id, teamId), eq(team.tournamentId, tId)))
				.returning({ id: team.id });
			if (updated.length === 0) {
				return fail(404, { error: 'Team not found' });
			}
			return { success: 'Team updated' };
		} catch (e) {
			if (isUniqueViolation(e)) {
				return fail(400, {
					error: 'A team with that name or acronym already exists in this tournament'
				});
			}
			console.error(e);
			return fail(500, { error: 'Failed to update team' });
		}
	},
	deleteTeam: async ({ params, request }) => {
		const data = await request.formData();
		const teamId: number = Number(data.get('team'));
		const tId: number = Number(params.tournamentId);

		// Games reference their teams with onDelete: 'restrict', so deleting a team that has been
		// scheduled would fail at the database. Check first so the reason is understandable.
		const scheduled = await db.query.game.findFirst({
			where: or(eq(game.homeTeamId, teamId), eq(game.awayTeamId, teamId))
		});
		if (scheduled) {
			return fail(409, {
				error: 'Cannot delete a team that is part of a game. Delete its games first.'
			});
		}

		await db.delete(team).where(and(eq(team.id, teamId), eq(team.tournamentId, tId)));
		return { success: 'Team deleted' };
	},
	newPlayer: async ({ params, request }) => {
		const tId = Number(params.tournamentId);
		const data = await request.formData();
		const playerName = data.get('playerName')?.toString().trim() ?? '';
		const playerNumber = Number(data.get('playerNumber'));
		const teamId = Number(data.get('teamId'));

		if (!playerName) {
			return fail(400, { error: 'Player name cannot be empty' });
		}
		if (!Number.isInteger(playerNumber) || playerNumber < 0) {
			return fail(400, { error: 'Player number must be a whole number of 0 or more' });
		}

		const teamRow = await db.query.team.findFirst({
			where: and(eq(team.id, teamId), eq(team.tournamentId, tId))
		});
		if (!teamRow) {
			return fail(404, { error: 'Team not found' });
		}

		try {
			await db.insert(player).values({
				name: playerName,
				number: playerNumber,
				teamId: teamId
			});
			return { success: 'Player added' };
		} catch (e) {
			if (isUniqueViolation(e)) {
				return fail(400, {
					error: `Number ${playerNumber} is already taken on ${teamRow.name}`
				});
			}
			console.error(e);
			return fail(500, { error: 'Failed to add player' });
		}
	},
	updatePlayer: async ({ params, request }) => {
		const tId = Number(params.tournamentId);
		const data = await request.formData();
		const playerId = Number(data.get('player'));
		const playerName = data.get('playerName')?.toString().trim() ?? '';
		const playerNumber = Number(data.get('playerNumber'));

		if (!playerName) {
			return fail(400, { error: 'Player name cannot be empty' });
		}
		if (!Number.isInteger(playerNumber) || playerNumber < 0) {
			return fail(400, { error: 'Player number must be a whole number of 0 or more' });
		}

		try {
			const updated = await db
				.update(player)
				.set({ name: playerName, number: playerNumber })
				.where(and(eq(player.id, playerId), inArray(player.teamId, teamsOfTournament(tId))))
				.returning({ id: player.id });
			if (updated.length === 0) {
				return fail(404, { error: 'Player not found' });
			}
			return { success: 'Player updated' };
		} catch (e) {
			if (isUniqueViolation(e)) {
				return fail(400, { error: `Number ${playerNumber} is already taken on this team` });
			}
			console.error(e);
			return fail(500, { error: 'Failed to update player' });
		}
	},
	deletePlayer: async ({ params, request }) => {
		const tId = Number(params.tournamentId);
		const data = await request.formData();
		const playerId = Number(data.get('player'));

		try {
			const deleted = await db
				.delete(player)
				.where(and(eq(player.id, playerId), inArray(player.teamId, teamsOfTournament(tId))))
				.returning({ id: player.id });
			if (deleted.length === 0) {
				return fail(404, { error: 'Player not found' });
			}
			return { success: 'Player removed' };
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Failed to remove player' });
		}
	},
	bulkAddPlayers: async ({ params, request }) => {
		const tId = Number(params.tournamentId);
		const data = await request.formData();
		const teamId = Number(data.get('teamId'));
		const roster = data.get('roster')?.toString() ?? '';

		const teamRow = await db.query.team.findFirst({
			where: and(eq(team.id, teamId), eq(team.tournamentId, tId))
		});
		if (!teamRow) {
			return fail(404, { error: 'Team not found' });
		}

		const rows: { number: number; name: string }[] = [];
		const invalid: string[] = [];
		for (const line of roster.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			const match = trimmed.match(/^(\d+)\s+(.+)$/);
			if (!match) {
				invalid.push(trimmed);
				continue;
			}
			rows.push({ number: Number(match[1]), name: match[2].trim() });
		}

		if (rows.length === 0) {
			return fail(400, { error: 'No players found. Use one per line: "7 John Smith".' });
		}
		if (invalid.length > 0) {
			return fail(400, {
				error: `Could not read: ${invalid.join(', ')}. Use one per line: "7 John Smith".`
			});
		}

		const numbers = new Set<number>();
		for (const row of rows) {
			if (numbers.has(row.number)) {
				return fail(400, {
					error: `Number ${row.number} appears more than once in the list`
				});
			}
			numbers.add(row.number);
		}

		try {
			await db.insert(player).values(rows.map((row) => ({ ...row, teamId })));
			return { success: `Added ${rows.length} players to ${teamRow.name}` };
		} catch (e) {
			if (isUniqueViolation(e)) {
				const existing = await db
					.select({ number: player.number })
					.from(player)
					.where(eq(player.teamId, teamId));
				const taken = existing
					.map((r) => r.number)
					.filter((n) => numbers.has(n))
					.toSorted((a, b) => a - b);
				return fail(400, {
					error: `Numbers already taken on ${teamRow.name}: ${taken.join(', ')}`
				});
			}
			console.error(e);
			return fail(500, { error: 'Failed to add players' });
		}
	}
} satisfies Actions;
