import { getGame } from '$lib/server/game.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(404, 'Invalid game id');

	const gameData = await getGame(gameId);
	if (!gameData) throw error(404, 'Game not found');

	return {
		gameData
	};
};
