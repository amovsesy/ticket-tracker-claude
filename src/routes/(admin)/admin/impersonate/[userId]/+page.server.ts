import { redirect, error } from '@sveltejs/kit';
import { requireAdmin, logAdminAction, getIpAddress, getUserAgent } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const admin = await requireAdmin(event);
	const targetUserId = event.params.userId;

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	const targetUser = await db.query.users.findFirst({
		where: eq(users.id, parseInt(targetUserId))
	});

	if (!targetUser) {
		throw error(404, 'User not found');
	}

	// Store original admin session and impersonation state in cookie
	event.cookies.set(
		'admin_impersonating',
		JSON.stringify({
			adminId: admin.id,
			adminEmail: admin.email,
			targetUserId: targetUser.id,
			targetEmail: targetUser.email,
			targetClerkId: targetUser.clerkId
		}),
		{
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 4 // 4 hours
		}
	);

	// Log the impersonation action
	await logAdminAction(
		db,
		admin.id,
		'impersonate_user',
		'user',
		targetUser.id,
		{ targetEmail: targetUser.email },
		getIpAddress(event),
		getUserAgent(event)
	);

	// Redirect to user's dashboard
	throw redirect(303, '/dashboard');
};
