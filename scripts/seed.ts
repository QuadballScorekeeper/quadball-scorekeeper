// src/scripts/seed.ts
//
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import * as schema from '../src/lib/server/db/schema';
import {
	tournament,
	team,
	player,
	game,
	gameEvent,
	user,
	eventTypeEnum
} from '../src/lib/server/db/schema';
import { generateUniqueGameCode } from '../src/lib/server/gameCode';
import { sql, eq } from 'drizzle-orm';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

// ------------------------------------------------------------------
// 1️⃣ Set up DB connection
const DATABASE_URL = 'postgres://testuser:testpassword@localhost:5432/testdb';
const pool = new Pool({
	connectionString: DATABASE_URL // e.g. postgres://user:pw@localhost:5432/db
});
const db = drizzle(pool, { schema });

// Create auth instance for seeding
const auth = betterAuth({
	baseURL: 'http://localhost:5173',
	secret: 'seed-secret-key-for-testing-only',
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: true,
				defaultValue: 'team_manager',
				input: false
			}
		}
	}
});

// ------------------------------------------------------------------
// 1️⃣.5 Reset the DB
async function resetDb() {
	const tables = [
		'game_event',
		'game',
		'player',
		'team',
		'tournament',
		'session',
		'account',
		'verification',
		'user'
	];
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
	// ---- Users (admin + team manager)
	// Use better-auth API to create users with properly hashed passwords
	await auth.api.signUpEmail({
		body: {
			email: 'admin@example.com',
			password: 'secret123',
			name: 'Admin User'
		}
	});

	// Update role to admin (custom field not handled by signUpEmail)
	await db.update(user).set({ role: 'admin' }).where(eq(user.email, 'admin@example.com'));

	await auth.api.signUpEmail({
		body: {
			email: 'manager@example.com',
			password: 'secret123',
			name: 'Team Manager'
		}
	});

	// Update role to team_manager (this is actually the default, but being explicit)
	await db.update(user).set({ role: 'team_manager' }).where(eq(user.email, 'manager@example.com'));

	console.log('✅ Created users:');
	console.log('   - admin@example.com (role: admin, password: secret123)');
	console.log('   - manager@example.com (role: team_manager, password: secret123)');

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
		for (let i = 0; i < TEAMS_PER_TOURNAMENT; i++) {
			teamRows.push({
				name: faker.location.country(),
				tournament: t.id
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
				team: tm.id
			});
		}
	}
	const insertedPlayers = await db.insert(player).values(playerRows).returning();

	// ---- Games (random schedule within the tournament)
	const gameRows: (typeof game.$inferInsert)[] = [];
	for (const t of insertedTournaments) {
		for (let i = 0; i < GAMES_PER_TOURNAMENT; i++) {
			const teamsInTournament = insertedTeams.filter((team) => team.tournament == t.id);
			const teams = faker.helpers.arrayElements(teamsInTournament, 2);

			// Generate unique game code
			const code = await generateUniqueGameCode(db);

			gameRows.push({
				start: faker.date.between({ from: t.start, to: t.end }),
				tournament: t.id,
				status: 'finished' as const,
				awayTeamId: teams[0].id,
				homeTeamId: teams[1].id,
				code
			});
		}
	}
	const insertedGames = await db.insert(game).values(gameRows).returning();

	// Log some game codes for testing
	console.log('\n📋 Sample game codes:');
	insertedGames.slice(0, 3).forEach((g) => {
		const homeTeam = insertedTeams.find((t) => t.id === g.homeTeamId);
		const awayTeam = insertedTeams.find((t) => t.id === g.awayTeamId);
		console.log(`  ${g.code} - ${homeTeam?.name} vs ${awayTeam?.name}`);
	});
	console.log('');

	// ---- GameEvents (populate each game with a few random events)
	const eventRows: (typeof gameEvent.$inferInsert)[] = [];
	const eventTypes = Object.values(eventTypeEnum.enumValues); // ['goal','penalty',...]
	for (const g of insertedGames) {
		// pick a random team from the tournament that the game belongs to
		const teamsInGame = insertedTeams.filter(
			(team) => team.id == g.homeTeamId || team.id == g.awayTeamId
		);

		eventRows.push({
			game: g.id,
			eventNum: 0,
			eventType: 'resume',
			team: null,
			player: null,
			timestamp: g.start
		});
		for (let i = 1; i < EVENTS_PER_GAME; i++) {
			const evTeam = faker.helpers.arrayElement(teamsInGame);
			const evPlayer = faker.helpers.arrayElement(
				insertedPlayers.filter((p) => p.team === evTeam.id)
			);

			eventRows.push({
				game: g.id,
				eventNum: i,
				eventType: faker.helpers.arrayElement(eventTypes) as any,
				team: evTeam.id,
				player: evPlayer.id,
				timestamp: new Date(g.start.getTime() + i * 27 * 1000) // 27‑second intervals
			});
		}

		eventRows.push({
			game: g.id,
			eventNum: EVENTS_PER_GAME,
			eventType: 'pause',
			team: null,
			player: null,
			timestamp: new Date(g.start.getTime() + faker.number.int({ min: 15, max: 30 }) * 60 * 1000)
		});
	}
	await db.insert(gameEvent).values(eventRows);

	console.log('✅ Seed completed!');
	await pool.end();
}

// ------------------------------------------------------------------
main().catch((e) => {
	console.error(e);
	process.exit(1);
});
