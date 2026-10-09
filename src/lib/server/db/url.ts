const PGLITE_SCHEME = 'pglite://';

export type DatabaseConnection =
	{ kind: 'pglite'; dataDir: string | undefined } | { kind: 'postgres'; url: string };

/**
 * Parses DATABASE_URL. 'pglite://<dir>' selects an embedded in-process Postgres (PGlite)
 * persisted to <dir>, 'pglite://:memory:' a fully in-memory one, and anything else a normal
 * postgres connection string.
 */
export function parseDatabaseUrl(url: string): DatabaseConnection {
	if (!url.startsWith(PGLITE_SCHEME)) return { kind: 'postgres', url };
	const dataDir = url.slice(PGLITE_SCHEME.length);
	if (dataDir === '' || dataDir === ':memory:') return { kind: 'pglite', dataDir: undefined };
	return { kind: 'pglite', dataDir };
}
