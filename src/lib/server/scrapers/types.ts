// Shared types for web scrapers

export type Platform = 'stubhub' | 'ticketmaster' | 'seatgeek';

export interface ScrapedPrice {
	price: number;
	section: string;
	row?: string;
	quantity: number;
	currency: string;
	fees?: number;
}

export interface ScraperResult {
	success: boolean;
	platform: Platform;
	eventId: string;
	eventName?: string;
	venue?: string;
	date?: Date;
	lowestPrice?: number;
	prices: ScrapedPrice[];
	error?: string;
	scrapedAt: Date;
}

export interface ScraperConfig {
	userAgent: string;
	timeout: number;
	retries: number;
	retryDelay: number;
}
