// Scraper factory and utilities

import type { Platform, ScraperResult } from './types';
import { BaseScraper } from './base';
import { StubHubScraper } from './stubhub';
import { parseEventUrl } from './parser';

/**
 * Get scraper instance for platform
 */
export function getScraper(platform: Platform): BaseScraper {
	switch (platform) {
		case 'stubhub':
			return new StubHubScraper();
		case 'ticketmaster':
		case 'seatgeek':
			throw new Error(`Scraper for ${platform} not implemented yet`);
		default:
			throw new Error(`Unknown platform: ${platform}`);
	}
}

/**
 * Scrape event from URL (auto-detect platform)
 */
export async function scrapeEventUrl(url: string): Promise<ScraperResult> {
	const parsed = parseEventUrl(url);

	if (!parsed) {
		return {
			success: false,
			platform: 'stubhub', // Default for error
			eventId: url,
			prices: [],
			error: 'Invalid or unsupported platform URL',
			scrapedAt: new Date()
		};
	}

	const scraper = getScraper(parsed.platform);
	return scraper.scrape(url);
}

// Re-export types and utilities
export * from './types';
export * from './parser';
export { BaseScraper } from './base';
export { StubHubScraper } from './stubhub';
