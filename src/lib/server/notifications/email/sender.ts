// Email notification sender using Resend

import { Resend } from 'resend';
import { generatePriceDropEmail, generatePriceDropEmailText } from './templates';

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

interface SendPriceDropEmailOptions {
	to: string;
	userName: string;
	eventName: string;
	venue: string;
	date: string;
	oldPrice?: number;
	newPrice: number;
	targetPrice: number;
	section?: string;
	eventUrl?: string;
	percentageChange?: number;
}

/**
 * Initialize Resend client
 */
function getResendClient(apiKey?: string): Resend | null {
	const key = apiKey || process.env.RESEND_API_KEY;
	if (!key) {
		console.error('RESEND_API_KEY not configured');
		return null;
	}
	return new Resend(key);
}

/**
 * Send email via Resend
 */
export async function sendEmail(
	options: SendEmailOptions,
	apiKey?: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
	const resend = getResendClient(apiKey);
	if (!resend) {
		return { success: false, error: 'Resend not configured' };
	}

	try {
		const result = await resend.emails.send({
			from: 'PriceTracker <alerts@pricetracker.com>',
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text
		});

		if (result.error) {
			return { success: false, error: result.error.message };
		}

		return { success: true, messageId: result.data?.id };
	} catch (error) {
		console.error('Resend email error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Send price drop alert email
 */
export async function sendPriceDropEmail(
	options: SendPriceDropEmailOptions,
	apiKey?: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
	const html = generatePriceDropEmail(options);
	const text = generatePriceDropEmailText(options);

	const subject = `🎉 Price Drop: ${options.eventName} is now $${options.newPrice}`;

	return sendEmail(
		{
			to: options.to,
			subject,
			html,
			text
		},
		apiKey
	);
}
