// Server-side Statsig integration for feature flags

import Statsig from 'statsig-node';

let initialized = false;

/**
 * Initialize Statsig on the server
 */
export async function initializeStatsig(apiKey?: string): Promise<void> {
	if (initialized) return;

	const key = apiKey || process.env.STATSIG_SERVER_KEY;
	if (!key) {
		console.warn('STATSIG_SERVER_KEY not configured - feature flags will default to false');
		return;
	}

	try {
		await Statsig.initialize(key, {
			environment: {
				tier: process.env.PUBLIC_STATSIG_TIER || 'development'
			}
		});
		initialized = true;
		console.log('Statsig initialized successfully');
	} catch (error) {
		console.error('Failed to initialize Statsig:', error);
	}
}

/**
 * Check if a feature is enabled for a user
 */
export function checkFeatureGate(
	gateName: string,
	userId: string,
	customIds?: Record<string, string>
): boolean {
	if (!initialized) {
		console.warn(`Statsig not initialized - feature gate "${gateName}" defaulting to false`);
		return false;
	}

	try {
		return Statsig.checkGate(
			{
				userID: userId,
				customIDs: customIds
			},
			gateName
		);
	} catch (error) {
		console.error(`Error checking feature gate "${gateName}":`, error);
		return false;
	}
}

/**
 * Get a dynamic config value
 */
// TODO: remove any and then uncomment to be able to use when we want to log events
// export function getDynamicConfig(
// 	configName: string,
// 	userId: string,
// 	customIds?: Record<string, string>
// ): any {
// 	if (!initialized) {
// 		console.warn(`Statsig not initialized - dynamic config "${configName}" returning empty`);
// 		return {};
// 	}
//
// 	try {
// 		return Statsig.getConfig(
// 			{
// 				userID: userId,
// 				customIDs: customIds
// 			},
// 			configName
// 		).value;
// 	} catch (error) {
// 		console.error(`Error getting dynamic config "${configName}":`, error);
// 		return {};
// 	}
// }

/**
 * Log an event to Statsig
 */
// TODO: remove any and then uncomment to be able to use when we want to log events
// export function logEvent(
// 	eventName: string,
// 	userId: string,
// 	value?: string | number,
// 	metadata?: Record<string, any>
// ): void {
// 	if (!initialized) return;
//
// 	try {
// 		Statsig.logEvent(
// 			{
// 				userID: userId
// 			},
// 			eventName,
// 			value,
// 			metadata
// 		);
// 	} catch (error) {
// 		console.error(`Error logging event "${eventName}":`, error);
// 	}
// }

/**
 * Shutdown Statsig (call this when the worker is shutting down)
 */
export async function shutdownStatsig(): Promise<void> {
	if (!initialized) return;

	try {
		await Statsig.shutdown();
		initialized = false;
	} catch (error) {
		console.error('Error shutting down Statsig:', error);
	}
}

/**
 * Feature flag names (for type safety)
 */
export const FeatureFlags = {
	SMS_NOTIFICATIONS: 'sms_notifications_enabled',
	DAILY_DIGEST: 'daily_digest_enabled',
	PREMIUM_FEATURES: 'premium_features_enabled'
} as const;
