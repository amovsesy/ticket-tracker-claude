// Notification manager - orchestrates email and SMS notifications

import type { Database } from '../db';
import { notifications } from '../db/schema';
import { sendPriceDropEmail } from './email/sender';
import { sendPriceDropSMS, formatPhoneNumber } from './sms/sender';
import { checkFeatureGate, FeatureFlags } from '../statsig';

interface User {
	id: number;
	email: string;
	phone: string | null;
	emailNotifications: boolean;
	smsNotifications: boolean;
}

interface Event {
	id: number;
	name: string;
	venue: string;
	date: Date;
}

interface TrackedEvent {
	id: number;
	userId: number;
	eventId: number;
	targetPrice: number;
	section: string | null;
}

interface PriceDropNotificationData {
	user: User;
	event: Event;
	trackedEvent: TrackedEvent;
	oldPrice?: number;
	newPrice: number;
	percentageChange?: number;
	eventUrl?: string;
}

/**
 * Send price drop notification via email and/or SMS
 */
export async function sendPriceDropNotification(
	db: Database,
	data: PriceDropNotificationData,
	env?: { RESEND_API_KEY?: string }
): Promise<{
	emailSent: boolean;
	smsSent: boolean;
	errors: string[];
	smsSkipped?: boolean;
}> {
	const errors: string[] = [];
	let emailSent = false;
	let smsSent = false;
	let smsSkipped = false;

	// Format date
	const dateStr = new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	}).format(data.event.date);

	// Send email notification
	if (data.user.emailNotifications) {
		try {
			const emailResult = await sendPriceDropEmail(
				{
					to: data.user.email,
					userName: data.user.email.split('@')[0], // Use email username as name
					eventName: data.event.name,
					venue: data.event.venue,
					date: dateStr,
					oldPrice: data.oldPrice,
					newPrice: data.newPrice,
					targetPrice: data.trackedEvent.targetPrice,
					section: data.trackedEvent.section || undefined,
					eventUrl: data.eventUrl,
					percentageChange: data.percentageChange
				},
				env?.RESEND_API_KEY
			);

			if (emailResult.success) {
				emailSent = true;

				// Log successful email notification
				await db.insert(notifications).values({
					userId: data.user.id,
					trackedEventId: data.trackedEvent.id,
					type: 'email',
					recipient: data.user.email,
					subject: `Price Drop: ${data.event.name}`,
					message: `Price dropped to $${data.newPrice}`,
					wasSuccessful: true,
					errorMessage: null
				});
			} else {
				errors.push(`Email failed: ${emailResult.error}`);

				// Log failed email notification
				await db.insert(notifications).values({
					userId: data.user.id,
					trackedEventId: data.trackedEvent.id,
					type: 'email',
					recipient: data.user.email,
					subject: `Price Drop: ${data.event.name}`,
					message: `Price dropped to $${data.newPrice}`,
					wasSuccessful: false,
					errorMessage: emailResult.error || 'Unknown error'
				});
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : 'Unknown error';
			errors.push(`Email exception: ${errorMsg}`);
			console.error('Email notification error:', error);
		}
	}

	// Send SMS notification (with feature flag check)
	if (data.user.smsNotifications && data.user.phone) {
		// Check if SMS notifications are enabled via feature flag
		const smsEnabled = checkFeatureGate(FeatureFlags.SMS_NOTIFICATIONS, data.user.id.toString());

		if (!smsEnabled) {
			console.log(`SMS notifications disabled by feature flag for user ${data.user.id}`);
			smsSkipped = true;
		} else {
			try {
				const smsResult = await sendPriceDropSMS({
					to: formatPhoneNumber(data.user.phone),
					eventName: data.event.name,
					newPrice: data.newPrice,
					targetPrice: data.trackedEvent.targetPrice,
					eventUrl: data.eventUrl
				});

				if (smsResult.success) {
					smsSent = true;

					// Log successful SMS notification
					await db.insert(notifications).values({
						userId: data.user.id,
						trackedEventId: data.trackedEvent.id,
						type: 'sms',
						recipient: data.user.phone,
						subject: null,
						message: `Price drop: ${data.event.name} - $${data.newPrice}`,
						wasSuccessful: true,
						errorMessage: null
					});
				} else {
					errors.push(`SMS failed: ${smsResult.error}`);

					// Log failed SMS notification
					await db.insert(notifications).values({
						userId: data.user.id,
						trackedEventId: data.trackedEvent.id,
						type: 'sms',
						recipient: data.user.phone,
						subject: null,
						message: `Price drop: ${data.event.name} - $${data.newPrice}`,
						wasSuccessful: false,
						errorMessage: smsResult.error || 'Unknown error'
					});
				}
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : 'Unknown error';
				errors.push(`SMS exception: ${errorMsg}`);
				console.error('SMS notification error:', error);
			}
		}
	}

	return { emailSent, smsSent, errors, smsSkipped };
}

/**
 * Send daily digest notification
 */
export async function sendDailyDigest(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_db: Database,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_userId: number,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_priceDrops: Array<{
		eventName: string;
		venue: string;
		oldPrice: number;
		newPrice: number;
		percentageChange: number;
		eventUrl?: string;
	}>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_env?: { RESEND_API_KEY?: string }
): Promise<{ success: boolean; error?: string }> {
	// Implementation for daily digest
	// This would fetch user, generate digest email, and send
	// Left as TODO for now since it's not critical for MVP
	return { success: true };
}
