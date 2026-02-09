// Statsig experiment configuration for pricing variants
export const PRICING_EXPERIMENT = 'pricing_page_variant';

export type PricingVariant =
	| 'launch_promo' // Variant 1: Current - Free + $0 Pro during launch
	| 'pay_per_event' // Variant 2: Free first event + fixed cost per additional
	| 'percentage_savings' // Variant 3: Free + percentage of savings
	| 'pay_per_sms_tips' // Variant 4: Free + pay per SMS + tips
	| 'tips_only'; // Variant 5: Free + tips only

export interface PricingConfig {
	variant: PricingVariant;
	promoEnabled: boolean;
	promoDiscount: number; // 0-100 percentage
	promoMessage?: string;

	// Variant-specific config
	payPerEventCost?: number;
	percentageSavings?: number; // 0-100 percentage
	smsPerMessageCost?: number;
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
	variant: 'launch_promo',
	promoEnabled: true,
	promoDiscount: 100,
	promoMessage: '100% Off Pro Plan - Launch Special',
	payPerEventCost: 0.99,
	percentageSavings: 10,
	smsPerMessageCost: 0.05
};

export const VARIANT_DESCRIPTIONS: Record<PricingVariant, string> = {
	launch_promo: 'Free + Pro Plan ($0 during launch)',
	pay_per_event: 'Free first event, then $0.99 per additional event',
	percentage_savings: 'Free tracking, pay 10% of savings you make',
	pay_per_sms_tips: 'Free tracking, $0.05 per SMS, plus optional tips',
	tips_only: 'Completely free, tips appreciated'
};
