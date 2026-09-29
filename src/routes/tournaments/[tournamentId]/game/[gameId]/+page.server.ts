import { getGame } from '$lib/server/game';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const gameId = Number(params.gameId);
	if (Number.isNaN(gameId)) throw error(400, 'Invalid game id');

	const gameInfo = await getGame(gameId);
	if (gameInfo == undefined) throw error(400, 'unable to find game');

	return {
		gameInfo
	};
};
