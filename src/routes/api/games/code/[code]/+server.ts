import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { game } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, cookies }) => {
	if (!params.code) {
		return json({ error: 'Code required' }, { status: 400 });
	}

	const code = params.code.toUpperCase();

	const gameData = await db.select().from(game).where(eq(game.code, code)).limit(1);

	if (gameData.length === 0) {
		return json({ error: 'Invalid code' }, { status: 404 });
	}

	// Set cookie to authorize access to this specific game
	cookies.set(`game_${gameData[0].id}_code`, code, {
		path: '/',
		maxAge: 60 * 60 * 24, // 24 hours
		httpOnly: true,
		sameSite: 'lax'
	});

	return json({ gameId: gameData[0].id });
};
