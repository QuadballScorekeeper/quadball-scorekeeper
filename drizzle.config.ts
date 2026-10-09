import { defineConfig } from 'drizzle-kit';
import { parseDatabaseUrl } from './src/lib/server/db/url';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set (drizzle-kit auto-loads the root .env)');

const connection = parseDatabaseUrl(url);

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	...(connection.kind === 'pglite'
		? { driver: 'pglite', dbCredentials: { url: connection.dataDir ?? ':memory:' } }
		: { dbCredentials: { url: connection.url } })
});
