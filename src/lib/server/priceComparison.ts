// Price comparison and notification logic

import type { TrackedEvent } from './db/schema';

/**
 * Determine if a notification should be sent based on price changes
 */
export function shouldNotify(
	trackedEvent: TrackedEvent,
	currentPrice: number,
	previousPrice?: number
): {
	shouldNotify: boolean;
	reason: string;
} {
	// Don't notify if tracking is paused
	if (trackedEvent.isPaused) {
		return { shouldNotify: false, reason: 'Tracking is paused' };
	}

	// Don't notify if not active
	if (!trackedEvent.isActive) {
		return { shouldNotify: false, reason: 'Tracking is not active' };
	}

	// Notify if price is below target
	if (currentPrice <= trackedEvent.targetPrice) {
		return {
			shouldNotify: true,
			reason: `Price dropped to $${currentPrice}, below target of $${trackedEvent.targetPrice}`
		};
	}

	// Notify if price dropped significantly (>10%) from previous check
	if (previousPrice && currentPrice < previousPrice) {
		const dropPercentage = ((previousPrice - currentPrice) / previousPrice) * 100;
		if (dropPercentage >= 10) {
			return {
				shouldNotify: true,
				reason: `Price dropped ${dropPercentage.toFixed(1)}% from $${previousPrice} to $${currentPrice}`
			};
		}
	}

	return { shouldNotify: false, reason: 'No significant price change' };
}

/**
 * Calculate percentage change between two prices
 */
export function calculateChangePercentage(currentPrice: number, previousPrice: number): number {
	if (previousPrice === 0) return 0;
	return ((currentPrice - previousPrice) / previousPrice) * 100;
}

/**
 * Get the lowest price from a list of prices
 */
export function getLowestPrice(prices: Array<{ price: number }>): number {
	if (prices.length === 0) return 0;
	return Math.min(...prices.map((p) => p.price));
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(price);
}

/**
 * Check if enough time has passed since last notification
 * (to avoid spamming users)
 */
export function canNotifyAgain(
	lastNotifiedAt: Date | null,
	minHoursBetweenNotifications: number = 24
): boolean {
	if (!lastNotifiedAt) return true;

	const hoursSinceLastNotification = (Date.now() - lastNotifiedAt.getTime()) / (1000 * 60 * 60);
	return hoursSinceLastNotification >= minHoursBetweenNotifications;
}

/**
 * Determine notification priority based on price drop
 */
export function getNotificationPriority(dropPercentage: number): 'high' | 'medium' | 'low' {
	if (dropPercentage >= 20) return 'high';
	if (dropPercentage >= 10) return 'medium';
	return 'low';
}
