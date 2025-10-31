import { db } from '$lib/server/db/client';
import { tournament } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load = async () => {
	const tournaments = await db.select().from(tournament).orderBy(desc(tournament.start));

	return {
		tournaments
	};
};
