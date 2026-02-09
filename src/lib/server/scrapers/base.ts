// Base scraper interface and utilities

import type { Platform, ScraperResult, ScraperConfig } from './types';

export abstract class BaseScraper {
	protected platform: Platform;
	protected config: ScraperConfig;

	constructor(platform: Platform, config?: Partial<ScraperConfig>) {
		this.platform = platform;
		this.config = {
			userAgent:
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			timeout: 10000,
			retries: 3,
			retryDelay: 1000,
			...config
		};
	}

	/**
	 * Parse URL to extract event ID
	 */
	abstract parseUrl(url: string): string | null;

	/**
	 * Validate if URL belongs to this platform
	 */
	abstract isValidUrl(url: string): boolean;

	/**
	 * Scrape event prices from the platform
	 */
	abstract scrape(eventIdOrUrl: string): Promise<ScraperResult>;

	/**
	 * Fetch HTML with retry logic
	 * Automatically uses browser scraper for sites that need JavaScript rendering
	 */
	protected async fetchWithRetry(url: string, attempt = 1): Promise<string> {
		// Check if we should use browser scraper (for bot-protected sites)
		if (this.shouldUseBrowser(url)) {
			return this.fetchWithBrowser(url, attempt);
		}

		// Otherwise use direct fetch
		return this.fetchDirect(url, attempt);
	}

	/**
	 * Check if URL needs browser scraping (JavaScript rendering)
	 */
	protected shouldUseBrowser(url: string): boolean {
		// Use browser for known bot-protected sites
		const browserRequired = [
			'stubhub.com',
			'ticketmaster.com',
			'seatgeek.com',
			'axs.com',
			'ticketnetwork.com'
		];

		return browserRequired.some((domain) => url.includes(domain));
	}

	/**
	 * Fetch using browser scraper service (for JavaScript-heavy sites)
	 */
	protected async fetchWithBrowser(url: string, attempt = 1): Promise<string> {
		const browserScraperUrl = process.env.BROWSER_SCRAPER_URL;

		if (!browserScraperUrl) {
			console.warn(
				'BROWSER_SCRAPER_URL not set, falling back to direct fetch (may fail for bot-protected sites)'
			);
			return this.fetchDirect(url, attempt);
		}

		try {
			const response = await fetch(`${browserScraperUrl}/scrape`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					url,
					timeout: this.config.timeout
				}),
				signal: AbortSignal.timeout(this.config.timeout + 5000) // Add 5s buffer
			});

			if (!response.ok) {
				throw new Error(`Browser scraper returned ${response.status}`);
			}

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Browser scraper failed');
			}

			console.log(`Successfully scraped ${url} using browser (${result.length} bytes)`);
			return result.html;
		} catch (error) {
			console.error(`Browser scraper error (attempt ${attempt}):`, error);

			if (attempt < this.config.retries) {
				await this.delay(this.config.retryDelay * attempt);
				return this.fetchWithBrowser(url, attempt + 1);
			}

			// Last resort: try direct fetch
			console.warn('Browser scraper failed, attempting direct fetch as fallback');
			return this.fetchDirect(url, 1);
		}
	}

	/**
	 * Direct fetch (no JavaScript rendering)
	 */
	protected async fetchDirect(url: string, attempt = 1): Promise<string> {
		try {
			const response = await fetch(url, {
				headers: {
					'User-Agent': this.config.userAgent,
					Accept:
						'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
					'Accept-Language': 'en-US,en;q=0.9',
					'Accept-Encoding': 'gzip, deflate, br',
					'Cache-Control': 'max-age=0',
					'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
					'Sec-Ch-Ua-Mobile': '?0',
					'Sec-Ch-Ua-Platform': '"macOS"',
					'Sec-Fetch-Dest': 'document',
					'Sec-Fetch-Mode': 'navigate',
					'Sec-Fetch-Site': 'none',
					'Sec-Fetch-User': '?1',
					'Upgrade-Insecure-Requests': '1',
					Referer: 'https://www.google.com/',
					Connection: 'keep-alive'
				},
				signal: AbortSignal.timeout(this.config.timeout)
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return await response.text();
		} catch (error) {
			if (attempt < this.config.retries) {
				await this.delay(this.config.retryDelay * attempt);
				return this.fetchDirect(url, attempt + 1);
			}
			throw error;
		}
	}

	/**
	 * Delay helper for retry logic
	 */
	protected delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Extract text from HTML using regex pattern
	 */
	protected extractText(html: string, pattern: RegExp): string | null {
		const match = html.match(pattern);
		return match ? match[1].trim() : null;
	}

	/**
	 * Extract all matches from HTML using regex pattern
	 */
	protected extractAll(html: string, pattern: RegExp): string[] {
		const matches: string[] = [];
		let match;
		while ((match = pattern.exec(html)) !== null) {
			matches.push(match[1].trim());
		}
		return matches;
	}

	/**
	 * Parse price string to number (removes $, commas, etc.)
	 */
	protected parsePrice(priceStr: string): number {
		const cleaned = priceStr.replace(/[$,\s]/g, '');
		const price = parseFloat(cleaned);
		return isNaN(price) ? 0 : price;
	}
}
