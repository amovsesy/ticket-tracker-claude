// SMS notification sender using Plivo

import * as plivo from 'plivo';

interface SendSMSOptions {
	to: string;
	message: string;
}

interface PlivoConfig {
	authId: string;
	authToken: string;
	phoneNumber: string;
}

/**
 * Get Plivo configuration from environment
 */
function getPlivoConfig(): PlivoConfig | null {
	const authId = process.env.PLIVO_AUTH_ID;
	const authToken = process.env.PLIVO_AUTH_TOKEN;
	const phoneNumber = process.env.PLIVO_PHONE_NUMBER;

	if (!authId || !authToken || !phoneNumber) {
		console.error('Plivo credentials not configured');
		return null;
	}

	return { authId, authToken, phoneNumber };
}

/**
 * Initialize Plivo client
 */
function getPlivoClient(config?: PlivoConfig): plivo.Client | null {
	const plivoConfig = config || getPlivoConfig();
	if (!plivoConfig) return null;

	return new plivo.Client(plivoConfig.authId, plivoConfig.authToken);
}

/**
 * Send SMS via Plivo
 */
export async function sendSMS(
	options: SendSMSOptions,
	config?: PlivoConfig
): Promise<{ success: boolean; error?: string; messageUuid?: string }> {
	const client = getPlivoClient(config);
	const plivoConfig = config || getPlivoConfig();

	if (!client || !plivoConfig) {
		return { success: false, error: 'Plivo not configured' };
	}

	try {
		// Format phone number (Plivo requires E.164 format)
		const toNumber = options.to.startsWith('+') ? options.to : `+1${options.to}`;

		const response = await client.messages.create(
			plivoConfig.phoneNumber,
			toNumber,
			options.message
		);

		return {
			success: true,
			messageUuid: Array.isArray(response.messageUuid)
				? response.messageUuid[0]
				: response.messageUuid
		};
	} catch (error) {
		console.error('Plivo SMS error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Send price drop SMS alert
 */
export async function sendPriceDropSMS(
	options: {
		to: string;
		eventName: string;
		newPrice: number;
		targetPrice: number;
		eventUrl?: string;
	},
	config?: PlivoConfig
): Promise<{ success: boolean; error?: string; messageUuid?: string }> {
	const message = `🎉 Price Alert! ${options.eventName} dropped to $${options.newPrice} (Target: $${options.targetPrice}). ${options.eventUrl ? `View: ${options.eventUrl}` : 'Check PriceTracker app!'}`;

	return sendSMS({ to: options.to, message }, config);
}

/**
 * Format phone number for SMS
 */
export function formatPhoneNumber(phone: string): string {
	// Remove all non-digit characters
	const cleaned = phone.replace(/\D/g, '');

	// Add +1 for US/Canada if not present
	if (cleaned.length === 10) {
		return `+1${cleaned}`;
	}

	// Add + if missing
	if (!phone.startsWith('+')) {
		return `+${cleaned}`;
	}

	return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;
}
