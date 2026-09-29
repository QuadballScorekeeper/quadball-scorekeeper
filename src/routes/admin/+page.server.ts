import { db } from '$lib/server/db/client';
import { tournament } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { Actions } from './$types';

export const load = async () => {
	// Check who's logged in and only show tournaments where they are set as admin
	const tournaments = await db.query.tournament.findMany({
		orderBy: desc(tournament.start)
	});

	return {
		tournaments
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		await db.insert(tournament).values({
			name: data.get('name')!.toString(),
			start: new Date(),
			end: new Date()
		});
	}
} satisfies Actions;
