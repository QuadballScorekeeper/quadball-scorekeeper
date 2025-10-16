import { db } from '$lib/server/db/client';
import { tournament } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load = async () => {
	// Grab every tournament, order by start date (newest first)
	const tournaments = await db.select().from(tournament).orderBy(desc(tournament.start));

	// The data we return becomes `data` in the page component
	return {
		tournaments
	};
};
