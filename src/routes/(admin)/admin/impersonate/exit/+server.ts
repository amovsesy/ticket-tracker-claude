import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	// Clear the impersonation cookie
	event.cookies.delete('admin_impersonating', { path: '/' });

	// Redirect back to admin panel
	throw redirect(303, '/admin/users');
};
