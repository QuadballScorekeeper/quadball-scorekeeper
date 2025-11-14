import { getAllTournaments } from '$lib/server/tournament';

export const load = async () => {
	const tournaments = await getAllTournaments();
	return { tournaments };
};
