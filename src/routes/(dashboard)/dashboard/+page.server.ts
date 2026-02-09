import { getDb } from '$lib/server/db';
import { users, trackedEvents, events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { isDemoModeEnabled } from '$lib/server/demoMode';
import { generateMockEvents } from '$lib/server/mockData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	// Get user from session
	const session = locals.session;

	if (!session) {
		// This shouldn't happen because of auth middleware, but handle gracefully
		return {
			trackedEvents: [],
			isDemoMode: false
		};
	}

	if (!platform?.env?.DB) {
		return {
			trackedEvents: [],
			isDemoMode: false
		};
	}

	const db = getDb(platform.env.DB);

	// Get user from database
	const user = await db.query.users.findFirst({
		where: eq(users.clerkId, session.userId)
	});

	if (!user) {
		return {
			trackedEvents: [],
			isDemoMode: false
		};
	}

	// Check if demo mode is enabled
	const demoMode = await isDemoModeEnabled(db, user.id);

	if (demoMode) {
		// Return mock data
		const mockEvents = generateMockEvents(5);
		return {
			trackedEvents: mockEvents.map((event) => ({
				id: event.id,
				eventName: event.name,
				venue: event.venue,
				location: event.location,
				date: event.date,
				category: event.category,
				imageUrl: event.imageUrl,
				section: event.section,
				targetPrice: event.targetPrice,
				currentLowestPrice: event.currentPrice,
				percentageChange: event.percentageChange,
				lastChecked: event.lastChecked,
				priceHistory: event.priceHistory,
				isPaused: event.isPaused
			})),
			isDemoMode: true,
			userName: session.claims.name || session.claims.email || 'User'
		};
	}

	// Fetch real tracked events from database
	const userTrackedEvents = await db
		.select({
			id: trackedEvents.id,
			targetPrice: trackedEvents.targetPrice,
			section: trackedEvents.section,
			isPaused: trackedEvents.isPaused,
			lastNotifiedAt: trackedEvents.lastNotifiedAt,
			createdAt: trackedEvents.createdAt,
			eventId: events.id,
			eventName: events.name,
			eventVenue: events.venue,
			eventLocation: events.location,
			eventDate: events.date,
			eventCategory: events.category,
			eventImageUrl: events.imageUrl
		})
		.from(trackedEvents)
		.innerJoin(events, eq(trackedEvents.eventId, events.id))
		.where(eq(trackedEvents.userId, user.id));

	// Transform to match expected format (would need to fetch prices in real implementation)
	const formattedEvents = userTrackedEvents.map((te) => ({
		id: te.id,
		eventName: te.eventName,
		venue: te.eventVenue,
		location: te.eventLocation,
		date: te.eventDate,
		category: te.eventCategory,
		imageUrl:
			te.eventImageUrl ||
			'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
		section: te.section || 'Any',
		targetPrice: te.targetPrice,
		currentLowestPrice: 0, // TODO: Fetch from price_history
		percentageChange: 0, // TODO: Calculate from price_history
		lastChecked: new Date(), // TODO: Get from platform_sources.lastScrapedAt
		priceHistory: [], // TODO: Fetch from price_history
		isPaused: te.isPaused
	}));

	return {
		trackedEvents: formattedEvents,
		isDemoMode: false,
		userName: session.claims.name || session.claims.email || 'User'
	};
};
