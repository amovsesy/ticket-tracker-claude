import { error, fail, redirect } from '@sveltejs/kit';
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

const VALID_VARIANTS = [
	'launch_promo',
	'pay_per_event',
	'percentage_savings',
	'pay_per_sms_tips',
	'tips_only'
];

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	const variant = event.params.variant;

	if (!VALID_VARIANTS.includes(variant)) {
		throw error(404, 'Invalid pricing variant');
	}

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	// Get current pricing config from database
	const configs = await db.select().from(pricingConfig).limit(1);
	const currentConfig = configs[0] || DEFAULT_PRICING_CONFIG;

	return {
		variant,
		variantName: VARIANT_DESCRIPTIONS[variant as keyof typeof VARIANT_DESCRIPTIONS],
		currentConfig,
		isActive: currentConfig.variant === variant
	};
};

export const actions: Actions = {
	updateCosts: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const formData = await event.request.formData();

		const payPerEventCost = parseFloat(formData.get('payPerEventCost') as string);
		const percentageSavings = parseInt(formData.get('percentageSavings') as string);
		const smsPerMessageCost = parseFloat(formData.get('smsPerMessageCost') as string);

		try {
			// Get current config
			const existing = await db.select().from(pricingConfig).limit(1);

			if (existing.length > 0) {
				// Update only cost fields
				await db
					.update(pricingConfig)
					.set({
						payPerEventCost,
						percentageSavings,
						smsPerMessageCost,
						updatedBy: admin.id,
						updatedAt: new Date()
					})
					.where(sql`1=1`);
			}

			await logAdminAction(
				db,
				admin.id,
				'update_variant_costs',
				'pricing_config',
				undefined,
				{ payPerEventCost, percentageSavings, smsPerMessageCost },
				getIpAddress(event),
				getUserAgent(event)
			);

			return { success: true };
		} catch (err) {
			console.error('Failed to update variant costs:', err);
			return fail(500, { error: 'Failed to update costs' });
		}
	},

	makeActive: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const variant = event.params.variant;

		if (!VALID_VARIANTS.includes(variant)) {
			throw error(400, 'Invalid variant');
		}

		try {
			// Get current config
			const existing = await db.select().from(pricingConfig).limit(1);

			if (existing.length > 0) {
				// Update only variant field
				await db
					.update(pricingConfig)
					.set({
						variant: variant as PricingVariant,
						updatedBy: admin.id,
						updatedAt: new Date()
					})
					.where(sql`1=1`);
			}

			await logAdminAction(
				db,
				admin.id,
				'set_active_variant',
				'pricing_config',
				undefined,
				{ variant },
				getIpAddress(event),
				getUserAgent(event)
			);

			throw redirect(303, '/admin/pricing');
		} catch (err) {
			if (err instanceof Response) throw err;
			console.error('Failed to set active variant:', err);
			return fail(500, { error: 'Failed to set active variant' });
		}
	}
};
