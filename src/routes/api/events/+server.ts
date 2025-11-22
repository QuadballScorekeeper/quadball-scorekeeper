import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/client';
import { gameEvent, type InsertGameEvent } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { broadcastGameEvent } from '$lib/stream';
import type { GameEvent } from '$lib/client/GameEvent.svelte';

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
		game,
		eventNum
	}: { game: InsertGameEvent['game']; eventNum: InsertGameEvent['eventNum'] } =
		await request.json();

	try {
		await db
			.delete(gameEvent)
			.where(and(eq(gameEvent.game, game), eq(gameEvent.eventNum, eventNum)));
	} catch (error) {
		console.error(error);
		return json({ success: false, error: 'Error deleting row' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
};
