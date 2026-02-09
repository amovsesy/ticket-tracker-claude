import { error } from '@sveltejs/kit';
import { requireAdmin, logAdminAction, getIpAddress, getUserAgent } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { users, trackedEvents, events, notifications, userDemoMode } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { toggleDemoMode } from '$lib/server/demoMode';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const admin = await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);
	const userId = parseInt(event.params.id);

	if (isNaN(userId)) {
		throw error(400, 'Invalid user ID');
	}

	// Get user details
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId)
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	// Get tracked events with full event details
	const userTrackedEvents = await db
		.select({
			id: trackedEvents.id,
			targetPrice: trackedEvents.targetPrice,
			section: trackedEvents.section,
			isActive: trackedEvents.isActive,
			isPaused: trackedEvents.isPaused,
			lastNotifiedAt: trackedEvents.lastNotifiedAt,
			createdAt: trackedEvents.createdAt,
			eventId: events.id,
			eventName: events.name,
			eventVenue: events.venue,
			eventDate: events.date,
			eventCategory: events.category
		})
		.from(trackedEvents)
		.innerJoin(events, eq(trackedEvents.eventId, events.id))
		.where(eq(trackedEvents.userId, userId))
		.orderBy(desc(trackedEvents.createdAt));

	// Get notification history (last 30 days)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const userNotifications = await db
		.select({
			id: notifications.id,
			type: notifications.type,
			recipient: notifications.recipient,
			subject: notifications.subject,
			message: notifications.message,
			sentAt: notifications.sentAt,
			wasSuccessful: notifications.wasSuccessful,
			errorMessage: notifications.errorMessage,
			eventName: events.name
		})
		.from(notifications)
		.innerJoin(trackedEvents, eq(notifications.trackedEventId, trackedEvents.id))
		.innerJoin(events, eq(trackedEvents.eventId, events.id))
		.where(eq(notifications.userId, userId))
		.orderBy(desc(notifications.sentAt))
		.limit(50);

	// Check demo mode status
	const demoMode = await db.query.userDemoMode.findFirst({
		where: eq(userDemoMode.userId, userId)
	});

	// Log the view action
	await logAdminAction(
		db,
		admin.id,
		'view_user',
		'user',
		userId,
		{ userEmail: user.email },
		getIpAddress(event),
		getUserAgent(event)
	);

	return {
		user,
		trackedEvents: userTrackedEvents,
		notifications: userNotifications,
		isDemoMode: demoMode?.isEnabled || false
	};
};

export const actions: Actions = {
	toggleDemoMode: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const userId = parseInt(event.params.id);

		const formData = await event.request.formData();
		const enabled = formData.get('enabled') === 'true';

		await toggleDemoMode(db, userId, admin.id, enabled);

		await logAdminAction(
			db,
			admin.id,
			'toggle_demo_mode',
			'user',
			userId,
			{ enabled },
			getIpAddress(event),
			getUserAgent(event)
		);

		return { success: true, demoModeEnabled: enabled };
	},

	updateTier: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const userId = parseInt(event.params.id);

		const formData = await event.request.formData();
		const tier = formData.get('tier') as 'free' | 'pro';

		await db.update(users).set({ tier }).where(eq(users.id, userId));

		await logAdminAction(
			db,
			admin.id,
			'update_user_tier',
			'user',
			userId,
			{ tier },
			getIpAddress(event),
			getUserAgent(event)
		);

		return { success: true };
	},

	toggleAdmin: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const userId = parseInt(event.params.id);

		const formData = await event.request.formData();
		const isAdmin = formData.get('isAdmin') === 'true';

		await db.update(users).set({ isAdmin }).where(eq(users.id, userId));

		await logAdminAction(
			db,
			admin.id,
			'toggle_admin',
			'user',
			userId,
			{ isAdmin },
			getIpAddress(event),
			getUserAgent(event)
		);

		return { success: true };
	}
};
