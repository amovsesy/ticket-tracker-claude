import type { UserTier } from './db/schema';

/**
 * Feature limits for each tier
 */
export const TIER_LIMITS = {
	free: {
		maxTrackedEvents: 3,
		checkIntervalMinutes: 15,
		smsEnabled: false,
		priceHistoryDays: 7,
		features: [
			'Email notifications',
			'Basic price alerts',
			'7 days price history',
			'15-minute price checks'
		]
	},
	pro: {
		maxTrackedEvents: Infinity,
		checkIntervalMinutes: 1,
		smsEnabled: true,
		priceHistoryDays: Infinity,
		features: [
			'Unlimited event tracking',
			'Email & SMS notifications',
			'Real-time price monitoring (1min)',
			'Unlimited price history',
			'Priority support',
			'Advanced analytics'
		]
	}
} as const;

/**
 * Check if user can track more events based on their tier
 * @param tier - User's tier (free or pro)
 * @param currentTrackedCount - Number of events currently tracked
 * @returns Whether user can add more events
 */
export function canTrackMoreEvents(tier: UserTier, currentTrackedCount: number): boolean {
	const limit = TIER_LIMITS[tier].maxTrackedEvents;
	return currentTrackedCount < limit;
}

/**
 * Get remaining event slots for user
 * @param tier - User's tier (free or pro)
 * @param currentTrackedCount - Number of events currently tracked
 * @returns Number of remaining slots, or Infinity for pro users
 */
export function getRemainingSlots(tier: UserTier, currentTrackedCount: number): number {
	const limit = TIER_LIMITS[tier].maxTrackedEvents;
	if (limit === Infinity) return Infinity;
	return Math.max(0, limit - currentTrackedCount);
}

/**
 * Check if user's tier allows SMS notifications
 * @param tier - User's tier (free or pro)
 * @returns Whether SMS is enabled for this tier
 */
export function canUseSMS(tier: UserTier): boolean {
	return TIER_LIMITS[tier].smsEnabled;
}

/**
 * Get price check interval for user's tier
 * @param tier - User's tier (free or pro)
 * @returns Check interval in minutes
 */
export function getCheckInterval(tier: UserTier): number {
	return TIER_LIMITS[tier].checkIntervalMinutes;
}

/**
 * Get price history retention days for user's tier
 * @param tier - User's tier (free or pro)
 * @returns Number of days to retain price history
 */
export function getPriceHistoryDays(tier: UserTier): number {
	return TIER_LIMITS[tier].priceHistoryDays;
}

/**
 * Check if user needs to upgrade to access a feature
 * @param currentTier - User's current tier
 * @param requiredTier - Tier required for feature
 * @returns Whether upgrade is needed
 */
export function needsUpgrade(currentTier: UserTier, requiredTier: UserTier): boolean {
	const tierHierarchy: Record<UserTier, number> = { free: 0, pro: 1 };
	return tierHierarchy[currentTier] < tierHierarchy[requiredTier];
}

/**
 * Get tier display information
 * @param tier - User's tier
 * @returns Display information for the tier
 */
export function getTierInfo(tier: UserTier) {
	return {
		name: tier.charAt(0).toUpperCase() + tier.slice(1),
		limits: TIER_LIMITS[tier],
		badge: tier === 'pro' ? 'Pro' : 'Free'
	};
}
