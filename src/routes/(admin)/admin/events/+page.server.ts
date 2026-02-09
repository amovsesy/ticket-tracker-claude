import { error } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { events, trackedEvents, platformSources } from '$lib/server/db/schema';
import { sql, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	// Get all events with aggregated stats
	const allEvents = await db
		.select({
			id: events.id,
			name: events.name,
			venue: events.venue,
			location: events.location,
			date: events.date,
			category: events.category,
			imageUrl: events.imageUrl,
			createdAt: events.createdAt
		})
		.from(events)
		.orderBy(desc(events.date));

	// Get tracking counts for each event
	const trackingCounts = await db
		.select({
			eventId: trackedEvents.eventId,
			count: sql<number>`COUNT(DISTINCT ${trackedEvents.userId})`.as('count')
		})
		.from(trackedEvents)
		.groupBy(trackedEvents.eventId);

	// Get platform counts for each event
	const platformCounts = await db
		.select({
			eventId: platformSources.eventId,
			count: sql<number>`COUNT(*)`.as('count')
		})
		.from(platformSources)
		.groupBy(platformSources.eventId);

	// Map counts to events
	const trackingCountMap = new Map(trackingCounts.map((tc) => [tc.eventId, Number(tc.count)]));
	const platformCountMap = new Map(platformCounts.map((pc) => [pc.eventId, Number(pc.count)]));

	const eventsWithStats = allEvents.map((evt) => ({
		...evt,
		trackingUsersCount: trackingCountMap.get(evt.id) || 0,
		platformsCount: platformCountMap.get(evt.id) || 0
	}));

	return {
		events: eventsWithStats
	};
};
