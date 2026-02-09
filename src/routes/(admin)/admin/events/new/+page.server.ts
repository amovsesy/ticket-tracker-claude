import { error, redirect } from '@sveltejs/kit';
import { requireAdmin, logAdminAction, getIpAddress, getUserAgent } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { events, platformSources, priceHistory } from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const formData = await event.request.formData();

		// Validate required fields
		const name = formData.get('name') as string;
		const venue = formData.get('venue') as string;
		const location = formData.get('location') as string;
		const dateStr = formData.get('date') as string;
		const category = formData.get('category') as string;

		if (!name || !venue || !location || !dateStr) {
			return {
				error: 'Name, venue, location, and date are required'
			};
		}

		// Create event
		const [newEvent] = await db
			.insert(events)
			.values({
				name,
				venue,
				location,
				date: new Date(dateStr),
				category: category as 'sports' | 'concerts' | 'theater' | 'other',
				imageUrl: (formData.get('imageUrl') as string) || null,
				description: (formData.get('description') as string) || null
			})
			.returning();

		// Create platform sources if provided
		const platforms = ['stubhub', 'ticketmaster', 'seatgeek'] as const;
		for (const platform of platforms) {
			const url = formData.get(`${platform}_url`) as string;
			if (url && url.trim()) {
				await db.insert(platformSources).values({
					eventId: newEvent.id,
					platform,
					url: url.trim(),
					externalId: null
				});
			}
		}

		// Add initial price if provided
		const initialPrice = formData.get('initial_price') as string;
		const section = formData.get('section') as string;

		if (initialPrice && parseFloat(initialPrice) > 0) {
			// Get the first platform source we just created
			const platformSource = await db.query.platformSources.findFirst({
				where: (ps, { eq }) => eq(ps.eventId, newEvent.id)
			});

			if (platformSource) {
				await db.insert(priceHistory).values({
					platformSourceId: platformSource.id,
					price: parseFloat(initialPrice),
					section: section || 'General',
					quantity: null,
					percentageChange: null,
					scrapedAt: new Date()
				});
			}
		}

		// Log the action
		await logAdminAction(
			db,
			admin.id,
			'create_event',
			'event',
			newEvent.id,
			{ eventName: newEvent.name },
			getIpAddress(event),
			getUserAgent(event)
		);

		throw redirect(303, `/admin/events/${newEvent.id}`);
	}
};
