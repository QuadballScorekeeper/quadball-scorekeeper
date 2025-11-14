import { getGame } from '$lib/server/game.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid tournament id');

	const gameData = await getGame(gameId);

	return {
		gameData
	};
};
