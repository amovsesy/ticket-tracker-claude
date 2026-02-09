import { DEFAULT_PRICING_CONFIG, type PricingConfig } from '$lib/server/statsigConfig';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { pricingConfig as pricingConfigTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	let pricingConfig: PricingConfig = DEFAULT_PRICING_CONFIG;

	// Load from database (admin-controlled configuration)
	if (event.platform?.env?.DB) {
		try {
			const db = getDb(event.platform.env.DB);
			const configs = await db.select().from(pricingConfigTable).limit(1);

			if (configs.length > 0) {
				const dbConfig = configs[0];
				pricingConfig = {
					variant: dbConfig.variant as PricingConfig['variant'],
					promoEnabled: dbConfig.promoEnabled,
					promoDiscount: dbConfig.promoDiscount,
					promoMessage: dbConfig.promoMessage || undefined,
					payPerEventCost: dbConfig.payPerEventCost || undefined,
					percentageSavings: dbConfig.percentageSavings || undefined,
					smsPerMessageCost: dbConfig.smsPerMessageCost || undefined
				};
			}
		} catch (error) {
			console.error('Failed to load pricing config from database:', error);
			// Fall back to default config
		}
	}

	// TODO: Integrate with Statsig for A/B testing on top of admin controls
	// const statsigUser = { userID: event.locals.session?.userId || 'anonymous' };
	// const experiment = await statsigServer.getExperiment(statsigUser, PRICING_EXPERIMENT);
	// pricingConfig = experiment.get('config', pricingConfig);

	return {
		pricingConfig
	};
};
