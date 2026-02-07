import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import handleClerk from '$lib/server/handleClerk';
import { env } from '$env/dynamic/private';

// Protected routes that require authentication
const protectedPaths = ['/dashboard', '/events', '/add', '/track', '/settings'];

// Clerk authentication handler
const clerkHandler = handleClerk(env.CLERK_SECRET_KEY || '', {
	debug: false,
	protectedPaths,
	signInUrl: '/login'
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle(), clerkHandler);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
