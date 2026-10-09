import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/client';
import { gameEvent, type InsertGameEvent } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, asc, eq } from 'drizzle-orm';
import { broadcastEventsChanged, broadcastGameEvent } from '$lib/stream';
import type { GameEvent } from '$lib/client/GameEvent.svelte';

export const GET: RequestHandler = async ({ url }) => {
	const gameIdParam = url.searchParams.get('gameId');
	const gameId = Number(gameIdParam);
	if (gameIdParam === null || Number.isNaN(gameId)) {
		return json({ success: false, error: 'Invalid game id' }, { status: 400 });
	}

	try {
		// Replaying events to rebuild game state only works in order
		const events = await db.query.gameEvent.findMany({
			where: eq(gameEvent.gameId, gameId),
			orderBy: asc(gameEvent.eventNum)
		});
		return json(events, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error fetching rows' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const { newEvent }: { newEvent: GameEvent } = await request.json();

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

export const DELETE: RequestHandler = async ({ request }) => {
	const {
		gameId,
		eventNum
	}: { gameId: InsertGameEvent['gameId']; eventNum: InsertGameEvent['eventNum'] } =
		await request.json();

	try {
		await db
			.delete(gameEvent)
			.where(and(eq(gameEvent.gameId, gameId), eq(gameEvent.eventNum, eventNum)));
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error deleting row' }, { status: 500 });
	}

	broadcastEventsChanged(gameId);

	return json({ success: true }, { status: 200 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const {
		gameId,
		eventNum,
		playerNumber
	}: {
		gameId: InsertGameEvent['gameId'];
		eventNum: InsertGameEvent['eventNum'];
		playerNumber: InsertGameEvent['playerNumber'];
	} = await request.json();

	try {
		await db
			.update(gameEvent)
			.set({ playerNumber })
			.where(and(eq(gameEvent.gameId, gameId), eq(gameEvent.eventNum, eventNum)));
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error updating row' }, { status: 500 });
	}

	broadcastEventsChanged(gameId);

	return json({ success: true }, { status: 200 });
};
