import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

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
const DEFAULT_TEAM_COLOR = '#808080';

// Only the states that outlive a page load. 'paused' and 'timeout' are transient and derived
// from the event log by the client, see GameStatus in $lib/client/Game.svelte.ts
export const gameStatusEnum = pgEnum('game_status', ['scheduled', 'live', 'finished', 'cancelled']);

export const eventTypeEnum = pgEnum('event_type', [
	'goal',
	'catch',
	'blue_card',
	'yellow_card',
	'red_card',
	'ejection',
	'resume',
	'pause',
	'timeout',
	'start',
	'end'
]);

export const tournament = pgTable('tournament', {
	id: serial().primaryKey(),
	name: text().notNull(),
	start: timestamp().notNull(),
	end: timestamp().notNull()
});

export const tournamentRelations = relations(tournament, ({ many }) => ({
	teams: many(team),
	games: many(game)
}));
export type SelectTournament = InferSelectModel<typeof tournament>;

export const team = pgTable(
	'team',
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		acronym: text().notNull(),
		color: text().notNull().default(DEFAULT_TEAM_COLOR),
		tournamentId: integer()
			.notNull()
			.references(() => tournament.id, { onDelete: 'cascade' })
	},
	(table) => [
		index().on(table.tournamentId),
		unique().on(table.tournamentId, table.name),
		unique().on(table.tournamentId, table.acronym)
	]
);

export type SelectTeam = InferSelectModel<typeof team>;

export const teamRelations = relations(team, ({ one, many }) => ({
	tournament: one(tournament, { fields: [team.tournamentId], references: [tournament.id] }),
	players: many(player)
}));

export const player = pgTable(
	'player',
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		number: integer().notNull(),
		teamId: integer()
			.notNull()
			.references(() => team.id, { onDelete: 'cascade' })
	},
	(table) => [index().on(table.teamId), unique().on(table.teamId, table.number)]
);

export const playerRelations = relations(player, ({ one }) => ({
	team: one(team, { fields: [player.teamId], references: [team.id] })
}));

export type SelectPlayer = InferSelectModel<typeof player>;

export const game = pgTable(
	'game',
	{
		id: serial().primaryKey(),
		// When the game is scheduled to kick off. Never mutated once the game starts - the actual
		// kickoff is the timestamp of the 'start' event.
		scheduledStart: timestamp().notNull(),
		tournamentId: integer()
			.notNull()
			.references(() => tournament.id, { onDelete: 'cascade' }),
		status: gameStatusEnum().default('scheduled').notNull(),
		homeTeamId: integer()
			.notNull()
			.references(() => team.id, { onDelete: 'restrict' }),
		awayTeamId: integer()
			.notNull()
			.references(() => team.id, { onDelete: 'restrict' }),
		code: text().notNull().unique()
	},
	(table) => [index().on(table.tournamentId)]
);

export const gameRelations = relations(game, ({ one, many }) => ({
	tournament: one(tournament, { fields: [game.tournamentId], references: [tournament.id] }),
	events: many(gameEvent),
	homeTeam: one(team, { fields: [game.homeTeamId], references: [team.id] }),
	awayTeam: one(team, { fields: [game.awayTeamId], references: [team.id] })
}));

export type SelectGame = InferSelectModel<typeof game>;

export const gameEvent = pgTable(
	'game_event',
	{
		gameId: integer()
			.notNull()
			.references(() => game.id, { onDelete: 'cascade' }),
		eventNum: integer().notNull(),
		eventType: eventTypeEnum().notNull(),
		teamId: integer().references(() => team.id, { onDelete: 'restrict' }),
		// Jersey number, snapshotted rather than a reference to player.id, so that history stays
		// accurate when a roster is edited after the game.
		playerNumber: integer(),
		timestamp: timestamp().notNull()
	},
	(table) => [primaryKey({ columns: [table.gameId, table.eventNum] })]
);

export const gameEventRelations = relations(gameEvent, ({ one }) => ({
	game: one(game, { fields: [gameEvent.gameId], references: [game.id] }),
	team: one(team, { fields: [gameEvent.teamId], references: [team.id] })
}));

export type SelectGameEvent = InferSelectModel<typeof gameEvent>;
export type InsertGameEvent = InferInsertModel<typeof gameEvent>;
