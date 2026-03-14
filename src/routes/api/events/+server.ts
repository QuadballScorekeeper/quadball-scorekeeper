import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/client';
import { gameEvent, game, type InsertGameEvent } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { broadcastGameEvent } from '$lib/stream';
import type { GameEvent } from '$lib/client/GameEvent.svelte';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { newEvent }: { newEvent: GameEvent } = await request.json();
	const gameId = newEvent.game;

	// Check authorization via game code
	const authorizedGameCode = cookies.get(`game_${gameId}_code`);

	if (!authorizedGameCode) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Verify code matches game
	const gameData = await db.select().from(game).where(eq(game.id, gameId)).limit(1);
	if (!gameData[0] || gameData[0].code !== authorizedGameCode) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	newEvent.timestamp = new Date(newEvent.timestamp);
	try {
		await db.insert(gameEvent).values(newEvent);
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error adding row' }, { status: 500 });
	}

	broadcastGameEvent(newEvent);

	return json({ success: true }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const {
		game: gameId,
		eventNum
	}: { game: InsertGameEvent['game']; eventNum: InsertGameEvent['eventNum'] } =
		await request.json();

	// Check authorization via game code
	const authorizedGameCode = cookies.get(`game_${gameId}_code`);

	if (!authorizedGameCode) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Verify code matches game
	const gameData = await db.select().from(game).where(eq(game.id, gameId)).limit(1);
	if (!gameData[0] || gameData[0].code !== authorizedGameCode) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await db
			.delete(gameEvent)
			.where(and(eq(gameEvent.game, gameId), eq(gameEvent.eventNum, eventNum)));
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error deleting row' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
};
