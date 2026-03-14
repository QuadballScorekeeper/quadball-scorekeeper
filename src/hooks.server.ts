import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	// Route protection
	const path = event.url.pathname;

	// Protect admin routes - require admin role
	if (path.startsWith('/admin')) {
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			throw redirect(302, `/login?redirect=${encodeURIComponent(path)}`);
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
