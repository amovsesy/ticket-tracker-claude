import { redirect, error, type RequestEvent } from '@sveltejs/kit';
import { getDb } from './db';
import { users, adminAuditLogs, type User } from './db/schema';
import { eq } from 'drizzle-orm';

/**
 * Middleware to require admin authentication
 * Checks if the user is authenticated and has admin privileges
 * @throws {Redirect} 303 to /login if not authenticated
 * @throws {Redirect} 303 to /dashboard if not admin
 * @returns The admin user record
 */
export async function requireAdmin(event: RequestEvent): Promise<User> {
	const session = event.locals.session;

	if (!session?.userId) {
		throw redirect(303, '/login');
	}

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);
	const user = await db.query.users.findFirst({
		where: eq(users.clerkId, session.userId)
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	if (!user.isAdmin) {
		throw redirect(303, '/dashboard');
	}

	return user;
}

/**
 * Check if a user is an admin (without throwing errors)
 * @returns true if user is admin, false otherwise
 */
export async function isAdmin(event: RequestEvent): Promise<boolean> {
	const session = event.locals.session;

	if (!session?.userId) {
		return false;
	}

	if (!event.platform?.env?.DB) {
		return false;
	}

	const db = getDb(event.platform.env.DB);
	const user = await db.query.users.findFirst({
		where: eq(users.clerkId, session.userId)
	});

	return user?.isAdmin || false;
}

/**
 * Log an admin action to the audit trail
 * @param db Database instance
 * @param adminUserId The ID of the admin performing the action
 * @param action The action being performed (e.g., 'view_user', 'edit_event')
 * @param targetType The type of resource being affected (e.g., 'user', 'event')
 * @param targetId The ID of the affected resource
 * @param details Additional context as an object (will be JSON stringified)
 * @param ipAddress Optional IP address of the admin
 * @param userAgent Optional user agent string
 */
export async function logAdminAction(
	db: ReturnType<typeof getDb>,
	adminUserId: number,
	action: string,
	targetType?: string,
	targetId?: number,
	details?: Record<string, unknown>,
	ipAddress?: string,
	userAgent?: string
): Promise<void> {
	await db.insert(adminAuditLogs).values({
		adminUserId,
		action,
		targetType: targetType || null,
		targetId: targetId || null,
		details: details ? JSON.stringify(details) : null,
		ipAddress: ipAddress || null,
		userAgent: userAgent || null,
		createdAt: new Date()
	});
}

/**
 * Get the IP address from the request
 */
export function getIpAddress(event: RequestEvent): string | undefined {
	return (
		event.request.headers.get('cf-connecting-ip') ||
		event.request.headers.get('x-forwarded-for')?.split(',')[0] ||
		event.request.headers.get('x-real-ip') ||
		undefined
	);
}

/**
 * Get the user agent from the request
 */
export function getUserAgent(event: RequestEvent): string | undefined {
	return event.request.headers.get('user-agent') || undefined;
}
