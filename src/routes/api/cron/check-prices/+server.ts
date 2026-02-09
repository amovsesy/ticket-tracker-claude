// Scheduled worker to check prices for all tracked events

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { trackedEvents, platformSources, priceHistory, users, events } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getScraper } from '$lib/server/scrapers';
import {
	shouldNotify,
	calculateChangePercentage,
	canNotifyAgain
} from '$lib/server/priceComparison';
import { sendPriceDropNotification } from '$lib/server/notifications/notificationManager';
import { initializeStatsig } from '$lib/server/statsig';

interface PriceCheckResult {
	checked: number;
	updated: number;
	notificationsQueued: number;
	errors: number;
}

export const GET: RequestHandler = async ({ platform }) => {
	if (!platform?.env?.DB) {
		return json({ error: 'Database not configured' }, { status: 500 });
	}

	const db = getDb(platform.env.DB);
	const result: PriceCheckResult = {
		checked: 0,
		updated: 0,
		notificationsQueued: 0,
		errors: 0
	};

	// Initialize Statsig for feature flags
	await initializeStatsig(platform?.env?.STATSIG_SERVER_KEY);

	try {
		// Get all active tracked events
		const activeTrackedEvents = await db.query.trackedEvents.findMany({
			where: and(eq(trackedEvents.isActive, true), eq(trackedEvents.isPaused, false))
		});

		console.log(`Checking prices for ${activeTrackedEvents.length} tracked events`);

		// Process each tracked event
		for (const tracked of activeTrackedEvents) {
			try {
				// Get user
				const user = await db.query.users.findFirst({
					where: eq(users.id, tracked.userId)
				});

				if (!user) {
					console.warn(`User not found for tracked event ${tracked.id}`);
					continue;
				}

				// Get event
				const event = await db.query.events.findFirst({
					where: eq(events.id, tracked.eventId)
				});

				if (!event) {
					console.warn(`Event not found for tracked event ${tracked.id}`);
					continue;
				}

				// Get platform sources for this event
				const sources = await db.query.platformSources.findMany({
					where: eq(platformSources.eventId, event.id)
				});

				if (sources.length === 0) {
					console.warn(`No platform sources for event ${event.id}`);
					continue;
				}

				// Check if we should scrape based on user tier
				const scrapingInterval = user.tier === 'pro' ? 1 : 15; // 1 min for pro, 15 min for free
				const now = new Date();

				// Check each platform source
				for (const source of sources) {
					// Skip if scraped too recently
					if (source.lastScrapedAt) {
						const minutesSinceLastScrape =
							(now.getTime() - source.lastScrapedAt.getTime()) / (1000 * 60);
						if (minutesSinceLastScrape < scrapingInterval) {
							console.log(
								`Skipping ${source.platform} for event ${event.id} - scraped ${minutesSinceLastScrape.toFixed(1)}m ago`
							);
							continue;
						}
					}

					result.checked++;

					// Scrape the platform
					const scraper = getScraper(source.platform);
					const scrapeResult = await scraper.scrape(source.url);

					// Update last scraped timestamp
					await db
						.update(platformSources)
						.set({
							lastScrapedAt: now,
							...(scrapeResult.success && { lastSuccessfulScrapeAt: now })
						})
						.where(eq(platformSources.id, source.id));

					if (!scrapeResult.success || !scrapeResult.lowestPrice) {
						result.errors++;
						console.error(
							`Failed to scrape ${source.platform} for event ${event.id}: ${scrapeResult.error}`
						);
						continue;
					}

					// Get previous price
					const previousPrices = await db.query.priceHistory.findMany({
						where: eq(priceHistory.platformSourceId, source.id),
						orderBy: [desc(priceHistory.scrapedAt)],
						limit: 1
					});

					const previousPrice = previousPrices[0]?.price;
					const currentPrice = scrapeResult.lowestPrice;

					// Calculate percentage change
					const percentageChange = previousPrice
						? calculateChangePercentage(currentPrice, previousPrice)
						: null;

					// Store new price in history
					await db.insert(priceHistory).values({
						platformSourceId: source.id,
						price: currentPrice,
						section: scrapeResult.prices[0]?.section || null,
						quantity: scrapeResult.prices[0]?.quantity || null,
						percentageChange,
						scrapedAt: now
					});

					result.updated++;

					// Check if we should notify
					const notificationDecision = shouldNotify(tracked, currentPrice, previousPrice);

					if (notificationDecision.shouldNotify) {
						// Check if enough time has passed since last notification
						if (!canNotifyAgain(tracked.lastNotifiedAt, 24)) {
							console.log(
								`Skipping notification for tracked event ${tracked.id} - notified too recently`
							);
							continue;
						}

						// Send notification via email/SMS
						console.log(
							`Sending notification: Event: ${event.name}, Price: $${currentPrice}, Reason: ${notificationDecision.reason}`
						);

						try {
							const notificationResult = await sendPriceDropNotification(
								db,
								{
									user: {
										id: user.id,
										email: user.email,
										phone: user.phone,
										emailNotifications: user.emailNotifications,
										smsNotifications: user.smsNotifications
									},
									event: {
										id: event.id,
										name: event.name,
										venue: event.venue,
										date: event.date
									},
									trackedEvent: {
										id: tracked.id,
										userId: tracked.userId,
										eventId: tracked.eventId,
										targetPrice: tracked.targetPrice,
										section: tracked.section
									},
									oldPrice: previousPrice,
									newPrice: currentPrice,
									percentageChange,
									eventUrl: `https://pricetracker.com/events/${event.id}`
								},
								{ RESEND_API_KEY: platform?.env?.RESEND_API_KEY }
							);

							if (notificationResult.emailSent || notificationResult.smsSent) {
								result.notificationsQueued++;
								console.log(
									`Notification sent - Email: ${notificationResult.emailSent}, SMS: ${notificationResult.smsSent}${notificationResult.smsSkipped ? ' (SMS skipped by feature flag)' : ''}`
								);
							}

							if (notificationResult.errors.length > 0) {
								console.error('Notification errors:', notificationResult.errors);
							}

							// Update last notified timestamp
							await db
								.update(trackedEvents)
								.set({ lastNotifiedAt: now })
								.where(eq(trackedEvents.id, tracked.id));
						} catch (notifError) {
							console.error('Failed to send notification:', notifError);
							result.errors++;
						}
					}
				}
			} catch (error) {
				result.errors++;
				console.error(`Error processing tracked event ${tracked.id}:`, error);
			}
		}

		console.log('Price check complete:', result);

		return json({
			success: true,
			result,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Price check cron error:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				result
			},
			{ status: 500 }
		);
	}
};
