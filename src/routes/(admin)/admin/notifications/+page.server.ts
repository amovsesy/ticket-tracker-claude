import { error } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { notifications, users, trackedEvents, events } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	// Get recent notifications (last 100)
	const recentNotifications = await db
		.select({
			id: notifications.id,
			type: notifications.type,
			recipient: notifications.recipient,
			subject: notifications.subject,
			message: notifications.message,
			sentAt: notifications.sentAt,
			wasSuccessful: notifications.wasSuccessful,
			errorMessage: notifications.errorMessage,
			userEmail: users.email,
			eventName: events.name
		})
		.from(notifications)
		.innerJoin(users, eq(notifications.userId, users.id))
		.innerJoin(trackedEvents, eq(notifications.trackedEventId, trackedEvents.id))
		.innerJoin(events, eq(trackedEvents.eventId, events.id))
		.orderBy(desc(notifications.sentAt))
		.limit(100);

	// Get notification stats
	const stats = await db
		.select({
			total: sql<number>`COUNT(*)`,
			successful: sql<number>`SUM(CASE WHEN ${notifications.wasSuccessful} = 1 THEN 1 ELSE 0 END)`,
			failed: sql<number>`SUM(CASE WHEN ${notifications.wasSuccessful} = 0 THEN 1 ELSE 0 END)`,
			email: sql<number>`SUM(CASE WHEN ${notifications.type} = 'email' THEN 1 ELSE 0 END)`,
			sms: sql<number>`SUM(CASE WHEN ${notifications.type} = 'sms' THEN 1 ELSE 0 END)`
		})
		.from(notifications);

	return {
		notifications: recentNotifications,
		stats: {
			total: Number(stats[0]?.total || 0),
			successful: Number(stats[0]?.successful || 0),
			failed: Number(stats[0]?.failed || 0),
			email: Number(stats[0]?.email || 0),
			sms: Number(stats[0]?.sms || 0)
		}
	};
};
