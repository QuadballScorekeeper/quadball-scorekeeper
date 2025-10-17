import { db } from '$lib/server/db/client';
import { gameEvent, game } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';

// Add a cache for each gameId that saves enough info to make this cheap for new connections.
// The scorekeeper app can update this cache directly or just invalidate it when a pause/resume event is sent.
export async function getGameTime(gameId: number): Promise<number> {
	const gameInfo = await db.select().from(game).where(eq(game.id, gameId));
	if (!gameInfo.length) throw new Error('Game not found');

	const startTime = new Date(gameInfo[0].start).getTime();

	const events = await db
		.select()
		.from(gameEvent)
		.where(eq(gameEvent.game, gameId))
		.orderBy(asc(gameEvent.timestamp));

	let totalPaused = 0;
	let pauseStart: number | null = null;

	for (const event of events) {
		switch (event.eventType) {
			case 'timeout':
				console.debug('Timeout');
			case 'pause':
				console.debug('Game paused');
				pauseStart = event.timestamp.getTime();
				break;
			case 'resume':
				console.debug('Game resumed');
				if (!pauseStart) {
					console.debug('Trying to resume running game');
					break;
				}
				totalPaused += event.timestamp.getTime() - pauseStart;
				pauseStart = null;
				break;
		}
	}

	const now = pauseStart ?? Date.now();
	let gameTime = now - startTime;
	return Math.max(0, gameTime);
}

export async function getGameScores(
	gameId: number
): Promise<{ homeScore: number; awayScore: number }> {
	const gameInfo = await db.select().from(game).where(eq(game.id, gameId)).limit(1);
	if (gameInfo.length == 0) throw new Error('Game not found');

	let homeTeam: number = gameInfo[0].homeTeam;
	let awayTeam: number = gameInfo[0].awayTeam;
	let homeScore: number = 0;
	let awayScore: number = 0;

	const events = await db
		.select()
		.from(gameEvent)
		.where(eq(gameEvent.game, gameId))
		.orderBy(asc(gameEvent.timestamp));

	for (const event of events) {
		switch (event.eventType) {
			case 'goal':
				switch (event.team) {
					case homeTeam:
						homeScore++;
						break;
					case awayTeam:
						awayScore++;
						break;
				}
		}
	}

	return { homeScore, awayScore };
}
