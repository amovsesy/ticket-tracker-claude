import { error } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { users, trackedEvents, notifications } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	// Get users with aggregated stats
	const allUsers = await db
		.select({
			id: users.id,
			clerkId: users.clerkId,
			email: users.email,
			phone: users.phone,
			tier: users.tier,
			isAdmin: users.isAdmin,
			createdAt: users.createdAt
		})
		.from(users)
		.orderBy(sql`${users.createdAt} DESC`);

	// Get tracked events count for each user
	const trackedCounts = await db
		.select({
			userId: trackedEvents.userId,
			count: sql<number>`COUNT(*)`.as('count')
		})
		.from(trackedEvents)
		.groupBy(trackedEvents.userId);

	// Get notification counts for each user
	const notificationCounts = await db
		.select({
			userId: notifications.userId,
			count: sql<number>`COUNT(*)`.as('count')
		})
		.from(notifications)
		.groupBy(notifications.userId);

	// Map counts to users
	const trackedCountMap = new Map(trackedCounts.map((tc) => [tc.userId, Number(tc.count)]));
	const notificationCountMap = new Map(
		notificationCounts.map((nc) => [nc.userId, Number(nc.count)])
	);

	const usersWithStats = allUsers.map((user) => ({
		...user,
		trackedEventsCount: trackedCountMap.get(user.id) || 0,
		notificationsSent: notificationCountMap.get(user.id) || 0
	}));

	return {
		users: usersWithStats
	};
};
