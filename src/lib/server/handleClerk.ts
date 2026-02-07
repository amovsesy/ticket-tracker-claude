import type { Handle, RequestEvent } from '@sveltejs/kit';
import { verifySession } from './index';

type ClerkErrorWithReason = {
	reason?: string;
	[key: string]: unknown;
};

type ProtectedPath = string | ((event: RequestEvent) => boolean);

function debugLog(debug: boolean, message: string) {
	if (debug) {
		console.log(`[Clerk SvelteKit] ${message}`);
	}
}

export default function handleClerk(
	secretKey: string,
	{
		debug = false,
		protectedPaths = ['/dashboard'],
		signInUrl = '/login'
	}: {
		debug?: boolean;
		protectedPaths?: ProtectedPath[];
		signInUrl?: string;
	}
) {
	return (async ({ event, resolve }) => {
		const sessionToken = event.cookies.get('__session');

		debugLog(debug, event.url.pathname);

		if (sessionToken) {
			debugLog(debug, 'Found session token in cookies.');
			try {
				const session = await verifySession(secretKey, sessionToken);
				if (session) {
					debugLog(debug, 'Session verified successfully.');
					event.locals.session = session;
				} else {
					debugLog(debug, 'Session verification returned no session.');
				}
			} catch (error) {
				const reason = (error as ClerkErrorWithReason)?.reason ?? error;
				debugLog(debug, 'Session verification failed.\n' + reason);
			}
		} else {
			debugLog(debug, 'No session token found in cookies.');
		}

		// Protect the protected routes.
		if (
			!event.locals.session &&
			protectedPaths.find((path) =>
				typeof path === 'string' ? event.url.pathname.startsWith(path) : path(event)
			)
		) {
			debugLog(debug, 'No session found, redirecting to login screen.');
			const fullSignInUrl = new URL(signInUrl, event.url.origin);
			return Response.redirect(fullSignInUrl.toString() + '?redirectUrl=' + event.url.pathname);
		}

		return resolve(event);
	}) satisfies Handle;
}
