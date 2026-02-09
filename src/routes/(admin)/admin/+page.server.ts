import { error } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { users, events, trackedEvents, notifications } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	// Get system-wide statistics
	const [stats] = await db
		.select({
			totalUsers: sql<number>`COUNT(DISTINCT ${users.id})`,
			totalEvents: sql<number>`COUNT(DISTINCT ${events.id})`,
			totalTrackedEvents: sql<number>`COUNT(DISTINCT ${trackedEvents.id})`,
			totalNotifications: sql<number>`COUNT(DISTINCT ${notifications.id})`
		})
		.from(users)
		.leftJoin(events, sql`1=1`)
		.leftJoin(trackedEvents, sql`1=1`)
		.leftJoin(notifications, sql`1=1`);

	// Get recent activity (last 10 notifications)
	const recentNotifications = await db
		.select({
			id: notifications.id,
			type: notifications.type,
			recipient: notifications.recipient,
			sentAt: notifications.sentAt,
			wasSuccessful: notifications.wasSuccessful,
			userEmail: users.email
		})
		.from(notifications)
		.innerJoin(users, sql`${notifications.userId} = ${users.id}`)
		.orderBy(sql`${notifications.sentAt} DESC`)
		.limit(10);

	return {
		stats: {
			totalUsers: Number(stats?.totalUsers || 0),
			totalEvents: Number(stats?.totalEvents || 0),
			totalTrackedEvents: Number(stats?.totalTrackedEvents || 0),
			totalNotifications: Number(stats?.totalNotifications || 0)
		},
		recentNotifications
	};
};
