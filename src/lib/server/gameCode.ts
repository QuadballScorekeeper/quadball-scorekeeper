import { game } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Union type accepts both postgres-js (SvelteKit) and node-postgres (scripts)
type DbInstance = PostgresJsDatabase<any> | NodePgDatabase<any>;

// Generate 6-digit alphanumeric code (no I or O to avoid confusion with 1 and 0)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'; // 34 chars (excludes I, O)

export function generateGameCode(): string {
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += CHARS[Math.floor(Math.random() * CHARS.length)];
	}
	return code;
}

// Generate unique code with database check
export async function generateUniqueGameCode(db: DbInstance): Promise<string> {
	let attempts = 0;
	while (attempts < 10) {
		const code = generateGameCode();
		const existing = await db.select().from(game).where(eq(game.code, code)).limit(1);
		if (existing.length === 0) {
			return code;
		}
		attempts++;
	}
	throw new Error('Failed to generate unique game code after 10 attempts');
}
