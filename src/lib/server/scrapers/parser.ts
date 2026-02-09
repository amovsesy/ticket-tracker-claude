// URL parsing utilities for all platforms

import type { Platform } from './types';
import { StubHubScraper } from './stubhub';

interface ParsedUrl {
	platform: Platform;
	eventId: string;
}

/**
 * Detect platform from URL
 */
export function detectPlatform(url: string): Platform | null {
	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname.toLowerCase();

		if (hostname.includes('stubhub.com')) return 'stubhub';
		if (hostname.includes('ticketmaster.com')) return 'ticketmaster';
		if (hostname.includes('seatgeek.com')) return 'seatgeek';

		return null;
	} catch {
		return null;
	}
}

/**
 * Parse URL and extract platform + event ID
 */
export function parseEventUrl(url: string): ParsedUrl | null {
	const platform = detectPlatform(url);
	if (!platform) return null;

	let eventId: string | null = null;

	switch (platform) {
		case 'stubhub': {
			const scraper = new StubHubScraper();
			eventId = scraper.parseUrl(url);
			break;
		}
		case 'ticketmaster':
		case 'seatgeek':
			// TODO: Implement other platform parsers
			return null;
	}

	if (!eventId) return null;

	return { platform, eventId };
}

/**
 * Validate URL format
 */
export function isValidEventUrl(url: string): boolean {
	return parseEventUrl(url) !== null;
}
