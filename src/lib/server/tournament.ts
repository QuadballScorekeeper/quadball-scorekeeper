import { db } from '$lib/server/db/client';
import { tournament } from '$lib/server/db/schema';
import { desc, eq, type InferInsertModel } from 'drizzle-orm';

export async function getAllTournaments() {
	return db.query.tournament.findMany({
		orderBy: desc(tournament.start)
	});
}

export async function getTournament(tournamentId: number) {
	return db.query.tournament.findFirst({
		where: eq(tournament.id, tournamentId),
		with: {
			games: {
				with: {
					homeTeam: {
						with: {
							players: true
						}
					},
					awayTeam: {
						with: {
							players: true
						}
					},
					events: true
				}
			},
			teams: {
				with: {
					players: true
				}
			}
		}
	});
}

export function addTournament(tournamentData: InferInsertModel<typeof tournament>) {
	return db.insert(tournament).values(tournamentData).returning();
}

export function updateTournament(tournamentData: InferInsertModel<typeof tournament>) {
	if (!tournamentData.id) throw Error('Missing tournament ID');
	return db.update(tournament).set(tournamentData).where(eq(tournament.id, tournamentData.id));
}
