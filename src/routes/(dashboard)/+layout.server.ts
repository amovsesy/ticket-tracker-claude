import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Check if admin is impersonating
	const impersonatingCookie = event.cookies.get('admin_impersonating');
	let impersonating = null;

	if (impersonatingCookie) {
		try {
			impersonating = JSON.parse(impersonatingCookie);
		} catch {
			// Invalid cookie, ignore
		}
	}

	// Check if current user is an admin
	let isAdmin = false;
	if (event.locals.session?.userId && event.platform?.env?.DB) {
		try {
			const db = getDb(event.platform.env.DB);
			const user = await db.query.users.findFirst({
				where: eq(users.clerkId, event.locals.session.userId)
			});
			isAdmin = user?.isAdmin || false;
		} catch {
			// Error checking admin status, default to false
		}
	}

	return {
		impersonating,
		isAdmin
	};
};
