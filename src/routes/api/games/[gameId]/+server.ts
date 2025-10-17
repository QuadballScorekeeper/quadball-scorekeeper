
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/client';
import { game } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Game } from '$lib/models/Game.svelte';

export const PUT: RequestHandler = async ({ params, request }) => {
    let { start, status }: { start: Game["start"]; status: Game["status"]; } = await request.json();

    start = new Date(start)
    try {
        await db.update(game).set({ start: start, status: status }).where(eq(game.id, Number(params.gameId)));
    } catch (error) {
        console.error(error);
        return json({ success: false, error: 'Error adding row' }, { status: 500 });
    }

    return json({ success: true }, { status: 200 });
};