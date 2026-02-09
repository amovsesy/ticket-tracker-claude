import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import handleClerk from '$lib/server/handleClerk';
import { env } from '$env/dynamic/private';
import { getDb } from '$lib/server/db';
import { ensureUser } from '$lib/server/db/userSync';
import type { Handle } from '@sveltejs/kit';

// Protected routes that require authentication
const protectedPaths = ['/dashboard', '/events', '/add', '/track', '/settings', '/admin'];

// Clerk authentication handler
const clerkHandler = handleClerk(env.CLERK_SECRET_KEY || '', {
	debug: false,
	protectedPaths,
	signInUrl: '/login'
});

// User sync handler - ensures authenticated users exist in database
const userSyncHandler: Handle = async ({ event, resolve }) => {
	// If user is authenticated and we have database access, ensure they exist in DB
	if (event.locals.session?.userId && event.platform?.env?.DB) {
		try {
			const db = getDb(event.platform.env.DB);
			await ensureUser(db, event.locals.session.userId);
		} catch (error) {
			console.error('Failed to sync user to database:', error);
			// Don't block the request if sync fails
		}
	}

	return resolve(event);
};

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle(), clerkHandler, userSyncHandler);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
