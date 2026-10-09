import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { parseDatabaseUrl, type DatabaseConnection } from './url';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// A 'pglite://' DATABASE_URL runs an embedded in-process Postgres, so no database server has
// to be running locally. PGlite speaks the same pg dialect with the same query-builder and
// relational API, so its instance is presented under the postgres-js type; only raw
// db.execute() result shapes differ, and the app doesn't use those.
function createDb(connection: DatabaseConnection): PostgresJsDatabase<typeof schema> {
	if (connection.kind === 'pglite') {
		const pglite = new PGlite(connection.dataDir);
		// A hard-killed embedded Postgres can leave a corrupted WAL that PANICs on the next
		// startup ("could not locate a valid checkpoint record"), so shut it down cleanly when
		// the process is asked to terminate (e.g. Ctrl+C on `vite dev`).
		if (typeof process !== 'undefined') {
			for (const signal of ['SIGINT', 'SIGTERM'] as const) {
				process.once(signal, () => {
					pglite
						.close()
						.catch(() => {})
						.finally(() => process.kill(process.pid, signal));
				});
			}
		}
		return drizzlePglite(pglite, { schema }) as unknown as PostgresJsDatabase<typeof schema>;
	}
	return drizzle(postgres(connection.url), { schema });
}

export const db = createDb(parseDatabaseUrl(env.DATABASE_URL));
