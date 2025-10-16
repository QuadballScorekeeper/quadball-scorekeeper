import type { InferInsertModel, InferModelFromColumns, InferSelectModel } from 'drizzle-orm';
import {
	pgTable,
	serial,
	integer,
	index,
	text,
	timestamp,
	pgEnum,
	unique,
	primaryKey
} from 'drizzle-orm/pg-core';

export const gameStatusEnum = pgEnum('game_status', ['scheduled', 'live', 'finished']);

export const eventTypeEnum = pgEnum('event_type', [
	'goal',
	'catch',

	'blue_card',
	'yellow_card',
	'red_card',
	'ejection',

	'resume',
	'pause',
	'timeout'
]);

export const tournament = pgTable('tournament', {
	id: serial().primaryKey(),
	name: text().notNull(),
	start: timestamp().notNull(),
	end: timestamp().notNull()
});

export type SelectTournament = InferSelectModel<typeof tournament>;

export const team = pgTable(
	'team',
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		tournament: integer()
			.notNull()
			.references(() => tournament.id, { onDelete: 'cascade' })
	},
	(table) => [index().on(table.tournament), unique().on(table.tournament, table.name)]
);

export type SelectTeam = InferSelectModel<typeof team>;

export const player = pgTable(
	'player',
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		number: integer().notNull(),
		team: integer()
			.notNull()
			.references(() => team.id, { onDelete: 'cascade' })
	},
	(table) => [index().on(table.team), unique().on(table.team, table.number)]
);

export type SelectPLayer = InferSelectModel<typeof player>;

export const game = pgTable(
	'game',
	{
		id: serial().primaryKey(),
		start: timestamp().notNull(),
		tournament: integer()
			.notNull()
			.references(() => tournament.id, { onDelete: 'cascade' }),
		status: gameStatusEnum('scheduled').default('scheduled').notNull(),
		homeTeam: integer()
			.notNull()
			.references(() => team.id, { onDelete: 'cascade' }),
		awayTeam: integer()
			.notNull()
			.references(() => team.id, { onDelete: 'cascade' })
	},
	(table) => [index().on(table.tournament)]
);

export type SelectGame = InferSelectModel<typeof game>;

export const gameEvent = pgTable(
	'game_event',
	{
		game: integer()
			.notNull()
			.references(() => game.id, { onDelete: 'cascade' }),
		eventNum: integer().notNull(),
		eventType: eventTypeEnum().notNull(),
		team: integer().references(() => team.id, { onDelete: 'cascade' }),
		player: integer().references(() => player.id, { onDelete: 'cascade' }),
		timestamp: timestamp().notNull()
	},
	(table) => [primaryKey({ columns: [table.game, table.eventNum] })]
);

export type SelectGameEvent = InferSelectModel<typeof gameEvent>;
export type InsertGameEvent = InferInsertModel<typeof gameEvent>;

// Set up proper users with hashed pw
export const user = pgTable('app_user', {
	id: serial().primaryKey(),
	username: text().notNull().unique(),
	password: text().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull()
});
