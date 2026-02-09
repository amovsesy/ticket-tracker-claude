import { error } from '@sveltejs/kit';
import { requireAdmin, logAdminAction, getIpAddress, getUserAgent } from '$lib/server/adminAuth';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { sendPriceDropEmail } from '$lib/server/notifications/email/sender';
import { sendPriceDropSMS } from '$lib/server/notifications/sms/sender';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	if (!event.platform?.env?.DB) {
		throw error(500, 'Database not available');
	}

	const db = getDb(event.platform.env.DB);

	// Get all users for selection
	const allUsers = await db.select().from(users);

	return {
		users: allUsers
	};
};

export const actions: Actions = {
	sendCustom: async (event) => {
		const admin = await requireAdmin(event);

		if (!event.platform?.env?.DB) {
			throw error(500, 'Database not available');
		}

		const db = getDb(event.platform.env.DB);
		const formData = await event.request.formData();

		const type = formData.get('type') as 'email' | 'sms';
		const recipient = formData.get('recipient') as string;
		const subject = formData.get('subject') as string;
		const message = formData.get('message') as string;

		if (!recipient || !message) {
			return { error: 'Recipient and message are required' };
		}

		try {
			if (type === 'email') {
				if (!event.platform.env.RESEND_API_KEY) {
					return { error: 'Email service not configured (RESEND_API_KEY missing)' };
				}

				await sendPriceDropEmail(
					{
						to: recipient,
						userName: 'User',
						eventName: subject || 'Notification',
						venue: '',
						date: '',
						oldPrice: 0,
						newPrice: 0,
						targetPrice: 0,
						section: '',
						eventUrl: '',
						percentageChange: 0
					},
					event.platform.env.RESEND_API_KEY
				);
			} else {
				if (
					!event.platform.env.PLIVO_AUTH_ID ||
					!event.platform.env.PLIVO_AUTH_TOKEN ||
					!event.platform.env.PLIVO_PHONE_NUMBER
				) {
					return { error: 'SMS service not configured (Plivo credentials missing)' };
				}

				await sendPriceDropSMS(
					{
						to: recipient,
						eventName: subject || 'Notification',
						newPrice: 0,
						targetPrice: 0,
						eventUrl: ''
					},
					{
						authId: event.platform.env.PLIVO_AUTH_ID,
						authToken: event.platform.env.PLIVO_AUTH_TOKEN,
						phoneNumber: event.platform.env.PLIVO_PHONE_NUMBER
					}
				);
			}

			await logAdminAction(
				db,
				admin.id,
				'send_custom_notification',
				null,
				null,
				{ type, recipient },
				getIpAddress(event),
				getUserAgent(event)
			);

			return { success: true, message: 'Notification sent successfully' };
		} catch (err) {
			console.error('Failed to send notification:', err);
			return { error: 'Failed to send notification. Check server logs.' };
		}
	}
};
