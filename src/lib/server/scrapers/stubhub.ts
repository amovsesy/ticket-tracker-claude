// StubHub scraper implementation

import { BaseScraper } from './base';
import type { ScraperResult, ScrapedPrice } from './types';

export class StubHubScraper extends BaseScraper {
	constructor() {
		super('stubhub');
	}

	/**
	 * Parse StubHub URL to extract event ID
	 * Example: https://www.stubhub.com/taylor-swift-vancouver-tickets-2-6-2026/event/151234567/
	 */
	parseUrl(url: string): string | null {
		try {
			const urlObj = new URL(url);
			if (!this.isValidUrl(url)) return null;

			// Extract event ID from path
			const eventMatch = urlObj.pathname.match(/\/event\/(\d+)/);
			return eventMatch ? eventMatch[1] : null;
		} catch {
			return null;
		}
	}

	/**
	 * Validate if URL is from StubHub
	 */
	isValidUrl(url: string): boolean {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname.includes('stubhub.com');
		} catch {
			return false;
		}
	}

	/**
	 * Scrape event prices from StubHub
	 */
	async scrape(eventIdOrUrl: string): Promise<ScraperResult> {
		try {
			// Parse event ID from URL if needed
			let eventId: string;
			if (eventIdOrUrl.startsWith('http')) {
				const parsed = this.parseUrl(eventIdOrUrl);
				if (!parsed) {
					return this.errorResult(eventIdOrUrl, 'Invalid StubHub URL');
				}
				eventId = parsed;
			} else {
				eventId = eventIdOrUrl;
			}

			// Construct StubHub event page URL
			const url = `https://www.stubhub.com/event/${eventId}`;

			// Fetch HTML
			const html = await this.fetchWithRetry(url);

			// Extract event details
			const eventName = this.extractEventName(html);
			const venue = this.extractVenue(html);
			const dateStr = this.extractDate(html);
			const date = dateStr ? new Date(dateStr) : undefined;

			// Extract prices
			const prices = this.extractPrices(html);

			if (prices.length === 0) {
				// Debug: Log what we found in the HTML
				const hasNextData = html.includes('__NEXT_DATA__');
				const hasInitialState = html.includes('__INITIAL_STATE__');
				const hasJsonLd = html.includes('application/ld+json');

				console.log('StubHub scraping debug:', {
					eventId,
					hasNextData,
					hasInitialState,
					hasJsonLd,
					htmlLength: html.length,
					htmlPreview: html.substring(0, 500)
				});

				return this.errorResult(eventId, 'No prices found on page');
			}

			// Calculate lowest price
			const lowestPrice = Math.min(...prices.map((p) => p.price));

			return {
				success: true,
				platform: 'stubhub',
				eventId,
				eventName,
				venue,
				date,
				lowestPrice,
				prices,
				scrapedAt: new Date()
			};
		} catch (error) {
			return this.errorResult(
				eventIdOrUrl,
				error instanceof Error ? error.message : 'Unknown error'
			);
		}
	}

	/**
	 * Extract event name from HTML
	 */
	private extractEventName(html: string): string | undefined {
		// Try multiple patterns
		const patterns = [
			/<h1[^>]*class="[^"]*EventHeader[^"]*"[^>]*>([^<]+)<\/h1>/i,
			/<meta\s+property="og:title"\s+content="([^"]+)"/i,
			/<title>([^<]+)\s*\|\s*StubHub/i
		];

		for (const pattern of patterns) {
			const name = this.extractText(html, pattern);
			if (name) return name;
		}

		return undefined;
	}

	/**
	 * Extract venue from HTML
	 */
	private extractVenue(html: string): string | undefined {
		const patterns = [
			/<span[^>]*class="[^"]*VenueAddress[^"]*"[^>]*>([^<]+)<\/span>/i,
			/<meta\s+property="og:description"\s+content="[^"]*at\s+([^"]+)"/i
		];

		for (const pattern of patterns) {
			const venue = this.extractText(html, pattern);
			if (venue) return venue;
		}

		return undefined;
	}

	/**
	 * Extract event date from HTML
	 */
	private extractDate(html: string): string | undefined {
		const patterns = [
			/<meta\s+property="event:start_time"\s+content="([^"]+)"/i,
			/<time[^>]*datetime="([^"]+)"[^>]*>/i
		];

		for (const pattern of patterns) {
			const date = this.extractText(html, pattern);
			if (date) return date;
		}

		return undefined;
	}

	/**
	 * Extract all ticket listings with prices
	 */
	private extractPrices(html: string): ScrapedPrice[] {
		const prices: ScrapedPrice[] = [];

		try {
			// Method 1: Look for Next.js data (StubHub uses Next.js)
			const nextDataMatch = html.match(
				/<script[^>]*id="__NEXT_DATA__"[^>]*type="application\/json"[^>]*>(.*?)<\/script>/s
			);
			if (nextDataMatch) {
				try {
					const nextData = JSON.parse(nextDataMatch[1]);
					// Navigate through Next.js data structure
					const pageProps = nextData?.props?.pageProps;

					// Try to find listings/inventory data
					if (pageProps?.event?.inventory || pageProps?.listing || pageProps?.listings) {
						const inventory = pageProps.event?.inventory || pageProps.listing || pageProps.listings;
						const items = Array.isArray(inventory) ? inventory : [inventory];

						for (const item of items) {
							if (item.price || item.currentPrice || item.listPrice) {
								const priceValue = item.price || item.currentPrice || item.listPrice;
								const price = typeof priceValue === 'object' ? priceValue.amount : priceValue;

								prices.push({
									price: parseFloat(price),
									section: item.section || item.sectionName || 'General',
									quantity: item.quantity || item.availableQuantity || 1,
									currency: item.currency || 'USD'
								});
							}
						}
					}
				} catch (e) {
					console.error('Error parsing __NEXT_DATA__:', e);
				}
			}

			// Method 2: Look for embedded window state
			if (prices.length === 0) {
				const stateMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/s);
				if (stateMatch) {
					try {
						const state = JSON.parse(stateMatch[1]);
						// Try common paths for pricing data
						const listings = state?.listings || state?.inventory || state?.tickets;
						if (listings && Array.isArray(listings)) {
							for (const listing of listings) {
								if (listing.price) {
									prices.push({
										price: parseFloat(listing.price),
										section: listing.section || 'General',
										quantity: listing.quantity || 1,
										currency: listing.currency || 'USD'
									});
								}
							}
						}
					} catch (e) {
						console.error('Error parsing __INITIAL_STATE__:', e);
					}
				}
			}

			// Method 3: JSON-LD structured data
			if (prices.length === 0) {
				const jsonMatch = html.match(
					/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/is
				);
				if (jsonMatch) {
					try {
						const data = JSON.parse(jsonMatch[1]);
						if (data.offers && Array.isArray(data.offers)) {
							for (const offer of data.offers) {
								if (offer.price && offer.priceCurrency) {
									prices.push({
										price: parseFloat(offer.price),
										section: offer.category || 'General',
										quantity: offer.availableAtOrFrom || 1,
										currency: offer.priceCurrency
									});
								}
							}
						}
					} catch (e) {
						console.error('Error parsing JSON-LD:', e);
					}
				}
			}

			// Method 4: Fallback to HTML data attributes
			if (prices.length === 0) {
				const pricePattern = /data-price="([\d.]+)"[^>]*data-section="([^"]+)"/g;
				let match;
				while ((match = pricePattern.exec(html)) !== null) {
					prices.push({
						price: parseFloat(match[1]),
						section: match[2],
						quantity: 1,
						currency: 'USD'
					});
				}
			}
		} catch (error) {
			console.error('Error parsing prices:', error);
		}

		return prices;
	}

	/**
	 * Create error result
	 */
	private errorResult(eventId: string, error: string): ScraperResult {
		return {
			success: false,
			platform: 'stubhub',
			eventId,
			prices: [],
			error,
			scrapedAt: new Date()
		};
	}
}
