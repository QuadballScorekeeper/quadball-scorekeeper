// src/scripts/seed.ts
//
import { PGlite } from '@electric-sql/pglite';
import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import { tournament, team, player, game, gameEvent } from '../src/lib/server/db/schema';
import { parseDatabaseUrl } from '../src/lib/server/db/url';

// ------------------------------------------------------------------
// 1️⃣ Set up DB connection from DATABASE_URL (run via `npm run db:seed`)
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const connection = parseDatabaseUrl(DATABASE_URL);

let db: NodePgDatabase;
let close: () => Promise<unknown>;
if (connection.kind === 'pglite') {
	// PGlite speaks the same pg dialect, so present it under the node-postgres type.
	const client = new PGlite(connection.dataDir);
	db = drizzlePglite(client) as unknown as NodePgDatabase;
	close = () => client.close();
} else {
	const pool = new Pool({ connectionString: connection.url });
	db = drizzle(pool);
	close = () => pool.end();
}

// ------------------------------------------------------------------
// 1️⃣.5 Reset the DB
async function resetDb() {
	const tables = ['game_event', 'game', 'player', 'team', 'tournament'];
	const stmt = sql.raw(`
      TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(',')}
      RESTART IDENTITY CASCADE;
    `);
	await db.execute(stmt);
	console.log('🧹 DB cleared');
}

// ------------------------------------------------------------------
// 2️⃣ Helper constants
const NUM_TOURNAMENTS = 3;
const TEAMS_PER_TOURNAMENT = 4;
const PLAYERS_PER_TEAM = 12;
const GAMES_PER_TOURNAMENT = 6;
const EVENTS_PER_GAME = 30;

// ------------------------------------------------------------------
// 3️⃣ Seed function
async function main() {
	await resetDb();

	// ---- Tournaments
	const tournamentRows: (typeof tournament.$inferInsert)[] = [];
	for (let i = 0; i < NUM_TOURNAMENTS; i++) {
		const start = faker.date.past();
		tournamentRows.push({
			name: faker.location.city() + ' Cup',
			start: start,
			end: new Date(start.getTime() + 2 * (1000 * 60 * 60 * 24))
		});
	}
	const insertedTournaments = await db.insert(tournament).values(tournamentRows).returning();

	// ---- Teams (per tournament)
	const teamRows: (typeof team.$inferInsert)[] = [];
	for (const t of insertedTournaments) {
		const usedAcronyms = new Set<string>();
		for (let i = 0; i < TEAMS_PER_TOURNAMENT; i++) {
			const teamName = faker.location.country();
			// Generate 3-4 letter acronym from team name
			let acronym = teamName
				.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
				.split(/\s+/) // Split by whitespace
				.map((word) => word[0]) // Take first letter of each word
				.join('')
				.toUpperCase()
				.slice(0, 4); // Max 4 letters

			// If acronym is too short, pad with more letters from the name
			if (acronym.length < 3) {
				acronym = teamName
					.replace(/[^A-Za-z]/g, '')
					.toUpperCase()
					.slice(0, 4);
			}

			// Ensure unique acronym within tournament
			let finalAcronym = acronym;
			let suffix = 1;
			while (usedAcronyms.has(finalAcronym)) {
				finalAcronym = acronym.slice(0, 3) + suffix;
				suffix++;
			}
			usedAcronyms.add(finalAcronym);

			teamRows.push({
				name: teamName,
				acronym: finalAcronym,
				tournamentId: t.id
			});
		}
	}
	const insertedTeams = await db.insert(team).values(teamRows).returning();

	// ---- Players (per team)
	const playerRows: (typeof player.$inferInsert)[] = [];
	for (const tm of insertedTeams) {
		const usedNumbers = new Set<number>();
		for (let i = 0; i < PLAYERS_PER_TEAM; i++) {
			// ensure unique jersey numbers per team
			let num: number;
			do {
				num = faker.number.int({ min: 1, max: 99 });
			} while (usedNumbers.has(num));
			usedNumbers.add(num);

			playerRows.push({
				name: faker.person.fullName(),
				number: num,
				teamId: tm.id
			});
		}
	}
	const insertedPlayers = await db.insert(player).values(playerRows).returning();

	// ---- Games (random schedule within the tournament)
	const gameRows: (typeof game.$inferInsert)[] = [];
	for (const t of insertedTournaments) {
		for (let i = 0; i < GAMES_PER_TOURNAMENT; i++) {
			const teamsInTournament = insertedTeams.filter((team) => team.tournamentId == t.id);
			const teams = faker.helpers.arrayElements(teamsInTournament, 2);

			gameRows.push({
				scheduledStart: faker.date.between({ from: t.start, to: t.end }),
				tournamentId: t.id,
				status: 'finished' as const,
				awayTeamId: teams[0].id,
				homeTeamId: teams[1].id
			});
		}
	}
	const insertedGames = await db.insert(game).values(gameRows).returning();

	// ---- GameEvents (populate each game with a few random events)
	const eventRows: (typeof gameEvent.$inferInsert)[] = [];
	// Only events a team can be credited with. Clock events are added around them below, so that
	// replaying a seeded game produces a coherent finished game.
	const inPlayEventTypes = ['goal', 'blue_card', 'yellow_card', 'red_card'] as const;
	for (const g of insertedGames) {
		// pick a random team from the tournament that the game belongs to
		const teamsInGame = insertedTeams.filter(
			(team) => team.id == g.homeTeamId || team.id == g.awayTeamId
		);

		eventRows.push({
			gameId: g.id,
			eventNum: 0,
			eventType: 'start',
			teamId: null,
			playerNumber: null,
			timestamp: g.scheduledStart
		});
		for (let i = 1; i < EVENTS_PER_GAME; i++) {
			const evTeam = faker.helpers.arrayElement(teamsInGame);
			const evPlayer = faker.helpers.arrayElement(
				insertedPlayers.filter((p) => p.teamId === evTeam.id)
			);

			eventRows.push({
				gameId: g.id,
				eventNum: i,
				eventType: faker.helpers.arrayElement(inPlayEventTypes),
				teamId: evTeam.id,
				playerNumber: evPlayer.number,
				timestamp: new Date(g.scheduledStart.getTime() + i * 27 * 1000) // 27‑second intervals
			});
		}

		eventRows.push({
			gameId: g.id,
			eventNum: EVENTS_PER_GAME,
			eventType: 'end',
			teamId: null,
			playerNumber: null,
			timestamp: new Date(
				g.scheduledStart.getTime() + faker.number.int({ min: 15, max: 30 }) * 60 * 1000
			)
		});
	}
	await db.insert(gameEvent).values(eventRows);

	console.log('✅ Seed completed!');
	await close();
}

// ------------------------------------------------------------------
main().catch((e) => {
	console.error(e);
	process.exit(1);
});
