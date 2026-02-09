import { error, fail } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { requireAdmin, logAdminAction, getIpAddress, getUserAgent } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { pricingConfig } from '$lib/server/db/schema';
import {
	DEFAULT_PRICING_CONFIG,
	type PricingVariant,
	VARIANT_DESCRIPTIONS
} from '$lib/server/statsigConfig';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	// Get current pricing config from database
	const configs = await db.select().from(pricingConfig).limit(1);
	const currentConfig = configs[0] || DEFAULT_PRICING_CONFIG;

	return {
		currentConfig,
		variantDescriptions: VARIANT_DESCRIPTIONS
	};
};

export const actions: Actions = {
	updateConfig: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const formData = await event.request.formData();

		const variant = formData.get('variant') as string;
		const promoEnabled = formData.get('promoEnabled') === 'true';
		const promoDiscount = parseInt(formData.get('promoDiscount') as string);
		const promoMessage = formData.get('promoMessage') as string;
		const payPerEventCost = parseFloat(formData.get('payPerEventCost') as string);
		const percentageSavings = parseInt(formData.get('percentageSavings') as string);
		const smsPerMessageCost = parseFloat(formData.get('smsPerMessageCost') as string);

		try {
			// Check if config exists
			const existing = await db.select().from(pricingConfig).limit(1);

			if (existing.length > 0) {
				// Update existing config
				await db
					.update(pricingConfig)
					.set({
						variant: variant as PricingVariant,
						promoEnabled,
						promoDiscount,
						promoMessage,
						payPerEventCost,
						percentageSavings,
						smsPerMessageCost,
						updatedBy: admin.id,
						updatedAt: new Date()
					})
					.where(sql`1=1`);
			} else {
				// Insert new config
				await db.insert(pricingConfig).values({
					variant: variant as PricingVariant,
					promoEnabled,
					promoDiscount,
					promoMessage,
					payPerEventCost,
					percentageSavings,
					smsPerMessageCost,
					updatedBy: admin.id
				});
			}

			await logAdminAction(
				db,
				admin.id,
				'update_pricing_config',
				'pricing_config',
				undefined,
				{ variant, promoEnabled, promoDiscount },
				getIpAddress(event),
				getUserAgent(event)
			);

			return { success: true, message: 'Pricing configuration updated successfully' };
		} catch (err) {
			console.error('Failed to update pricing config:', err);
			return fail(500, { error: 'Failed to update pricing configuration' });
		}
	},

	updatePromo: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const formData = await event.request.formData();

		const promoEnabled = formData.get('promoEnabled') === 'true';
		const promoDiscount = parseInt(formData.get('promoDiscount') as string);
		const promoMessage = formData.get('promoMessage') as string;

		try {
			// Get current config
			const existing = await db.select().from(pricingConfig).limit(1);

			if (existing.length > 0) {
				// Update only promo fields
				await db
					.update(pricingConfig)
					.set({
						promoEnabled,
						promoDiscount,
						promoMessage,
						updatedBy: admin.id,
						updatedAt: new Date()
					})
					.where(sql`1=1`);
			}

			await logAdminAction(
				db,
				admin.id,
				'update_promo_settings',
				'pricing_config',
				undefined,
				{ promoEnabled, promoDiscount, promoMessage },
				getIpAddress(event),
				getUserAgent(event)
			);

			return { success: true };
		} catch (err) {
			console.error('Failed to update promo settings:', err);
			return fail(500, { error: 'Failed to update promotional settings' });
		}
	}
};
