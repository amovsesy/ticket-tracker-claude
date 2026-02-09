import { error, redirect } from '@sveltejs/kit';
import { requireAdmin, logAdminAction, getIpAddress, getUserAgent } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { events, platformSources, priceHistory, trackedEvents } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const admin = await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);
	const eventId = parseInt(event.params.id);

	if (isNaN(eventId)) {
		throw error(400, 'Invalid event ID');
	}

	// Get event details
	const evt = await db.query.events.findFirst({
		where: eq(events.id, eventId)
	});

	if (!evt) {
		throw error(404, 'Event not found');
	}

	// Get platform sources
	const platforms = await db.query.platformSources.findMany({
		where: eq(platformSources.eventId, eventId)
	});

	// Get price history
	const prices = await db
		.select()
		.from(priceHistory)
		.innerJoin(platformSources, eq(priceHistory.platformSourceId, platformSources.id))
		.where(eq(platformSources.eventId, eventId))
		.orderBy(desc(priceHistory.scrapedAt))
		.limit(20);

	// Get tracking users count
	const trackingUsers = await db
		.select()
		.from(trackedEvents)
		.where(eq(trackedEvents.eventId, eventId));

	// Log the view action
	await logAdminAction(
		db,
		admin.id,
		'view_event',
		'event',
		eventId,
		{ eventName: evt.name },
		getIpAddress(event),
		getUserAgent(event)
	);

	return {
		event: evt,
		platforms,
		prices: prices.map((p) => ({
			price: p.price_history.price,
			section: p.price_history.section,
			platform: p.platform_sources.platform,
			scrapedAt: p.price_history.scrapedAt
		})),
		trackingUsersCount: trackingUsers.length
	};
};

export const actions: Actions = {
	update: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const eventId = parseInt(event.params.id);
		const formData = await event.request.formData();

		// Update event
		await db
			.update(events)
			.set({
				name: formData.get('name') as string,
				venue: formData.get('venue') as string,
				location: formData.get('location') as string,
				date: new Date(formData.get('date') as string),
				category: formData.get('category') as 'sports' | 'concerts' | 'theater' | 'other',
				imageUrl: (formData.get('imageUrl') as string) || null,
				description: (formData.get('description') as string) || null,
				updatedAt: new Date()
			})
			.where(eq(events.id, eventId));

		await logAdminAction(
			db,
			admin.id,
			'update_event',
			'event',
			eventId,
			{},
			getIpAddress(event),
			getUserAgent(event)
		);

		return { success: true };
	},

	addPrice: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const eventId = parseInt(event.params.id);
		const formData = await event.request.formData();

		const price = parseFloat(formData.get('price') as string);
		const section = formData.get('section') as string;
		const platformId = parseInt(formData.get('platformId') as string);

		if (isNaN(price) || price <= 0) {
			return { error: 'Invalid price' };
		}

		await db.insert(priceHistory).values({
			platformSourceId: platformId,
			price,
			section: section || 'General',
			quantity: null,
			percentageChange: null,
			scrapedAt: new Date()
		});

		await logAdminAction(
			db,
			admin.id,
			'add_price',
			'event',
			eventId,
			{ price, section },
			getIpAddress(event),
			getUserAgent(event)
		);

		return { success: true };
	},

	delete: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const eventId = parseInt(event.params.id);

		// Get event details before deletion
		const evt = await db.query.events.findFirst({
			where: eq(events.id, eventId)
		});

		// Delete event (cascade will handle related records)
		await db.delete(events).where(eq(events.id, eventId));

		await logAdminAction(
			db,
			admin.id,
			'delete_event',
			'event',
			eventId,
			{ eventName: evt?.name },
			getIpAddress(event),
			getUserAgent(event)
		);

		throw redirect(303, '/admin/events');
	}
};
