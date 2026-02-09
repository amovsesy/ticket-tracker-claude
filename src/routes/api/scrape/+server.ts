// API endpoint for manual scraping

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { scrapeEventUrl } from '$lib/server/scrapers';
import { getDb } from '$lib/server/db';
import { events, platformSources, priceHistory, scrapingLogs } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';

interface ScrapeRequestBody {
	url: string;
}

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const body = (await request.json()) as ScrapeRequestBody;
		const { url } = body;

		if (!platform?.env?.DB) {
			return error(500, { message: 'Database not configured' });
		}

		const db = getDb(platform.env.DB);

		if (!url || typeof url !== 'string') {
			return error(400, { message: 'URL is required' });
		}

		// Scrape the event
		const result = await scrapeEventUrl(url);

		if (!result.success) {
			return error(500, { message: result.error || 'Scraping failed' });
		}

		// Check if event already exists (by name and venue since we don't have externalId)
		let eventRecord = result.eventName
			? await db.query.events.findFirst({
					where: and(eq(events.name, result.eventName), eq(events.venue, result.venue || ''))
				})
			: null;

		// Create event if it doesn't exist
		if (!eventRecord && result.eventName) {
			const [newEvent] = await db
				.insert(events)
				.values({
					name: result.eventName,
					venue: result.venue || 'Unknown Venue',
					location: result.venue || 'Unknown Location', // TODO: Parse city/state from venue
					date: result.date || new Date(),
					category: 'concerts', // Default category
					imageUrl: null
				})
				.returning();
			eventRecord = newEvent;
		}

		if (!eventRecord) {
			return error(500, { message: 'Failed to create event record' });
		}

		// Check if platform source exists
		let platformSource = await db.query.platformSources.findFirst({
			where: and(
				eq(platformSources.eventId, eventRecord.id),
				eq(platformSources.platform, result.platform)
			)
		});

		// Create platform source if it doesn't exist
		if (!platformSource) {
			const [newSource] = await db
				.insert(platformSources)
				.values({
					eventId: eventRecord.id,
					platform: result.platform,
					externalId: result.eventId,
					url,
					lastScrapedAt: result.scrapedAt,
					lastSuccessfulScrapeAt: result.scrapedAt
				})
				.returning();
			platformSource = newSource;

			// Log successful scraping
			await db.insert(scrapingLogs).values({
				platformSourceId: platformSource.id,
				status: 'success',
				errorMessage: null,
				responseCode: 200,
				duration: null
			});
		} else {
			// Update last scraped timestamp
			await db
				.update(platformSources)
				.set({
					lastScrapedAt: result.scrapedAt,
					lastSuccessfulScrapeAt: result.scrapedAt
				})
				.where(eq(platformSources.id, platformSource.id));

			// Log successful scraping
			await db.insert(scrapingLogs).values({
				platformSourceId: platformSource.id,
				status: 'success',
				errorMessage: null,
				responseCode: 200,
				duration: null
			});
		}

		// Store price history for each listing
		if (result.prices.length > 0 && platformSource) {
			// Calculate percentage change if there's previous price data
			const previousPrices = await db.query.priceHistory.findMany({
				where: eq(priceHistory.platformSourceId, platformSource.id),
				orderBy: [desc(priceHistory.scrapedAt)],
				limit: 1
			});

			const previousLowestPrice = previousPrices[0]?.price;
			let percentageChange: number | null = null;

			if (previousLowestPrice && result.lowestPrice) {
				percentageChange = ((result.lowestPrice - previousLowestPrice) / previousLowestPrice) * 100;
			}

			// Insert new price record (using lowest price)
			await db.insert(priceHistory).values({
				platformSourceId: platformSource.id,
				price: result.lowestPrice || result.prices[0].price,
				section: result.prices[0].section,
				quantity: result.prices[0].quantity,
				percentageChange,
				scrapedAt: result.scrapedAt
			});
		}

		return json({
			success: true,
			event: eventRecord,
			platformSource,
			result: {
				eventName: result.eventName,
				venue: result.venue,
				date: result.date,
				lowestPrice: result.lowestPrice,
				priceCount: result.prices.length
			}
		});
	} catch (err) {
		console.error('Scrape API error:', err);
		return error(500, {
			message: err instanceof Error ? err.message : 'Internal server error'
		});
	}
};
