import { getDb, users } from './index';
import type { D1Database } from '@cloudflare/workers-types';
import { eq } from 'drizzle-orm';
import { createClerkClient } from '@clerk/backend';
import { env } from '$env/dynamic/private';

// Initialize Clerk client
const getClerkClient = () => {
	if (!env.CLERK_SECRET_KEY) {
		throw new Error('CLERK_SECRET_KEY is not set');
	}
	return createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
};

/**
 * Ensure a user exists in the database
 * Syncs user from Clerk if they don't exist locally
 * @param db - D1 database instance
 * @param clerkId - Clerk user ID
 * @returns User record from database
 */
export async function ensureUser(db: ReturnType<typeof getDb>, clerkId: string) {
	// Check if user exists in database
	const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).get();

	if (existingUser) {
		return existingUser;
	}

	// User doesn't exist, fetch from Clerk and create
	try {
		const clerkClient = getClerkClient();
		const clerkUser = await clerkClient.users.getUser(clerkId);

		// Get primary email
		const primaryEmail =
			clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)
				?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

		// Get primary phone
		const primaryPhone = clerkUser.phoneNumbers.find(
			(phone) => phone.id === clerkUser.primaryPhoneNumberId
		)?.phoneNumber;

		if (!primaryEmail) {
			throw new Error('User must have an email address');
		}

		// Create new user in database with default free tier
		const [newUser] = await db
			.insert(users)
			.values({
				clerkId,
				email: primaryEmail,
				phone: primaryPhone || null,
				tier: 'free',
				emailNotifications: true,
				smsNotifications: false,
				notificationFrequency: 'realtime'
			})
			.returning();

		return newUser;
	} catch (error) {
		console.error('Error syncing user from Clerk:', error);
		throw new Error('Failed to sync user');
	}
}

/**
 * Get user by Clerk ID
 * @param db - D1 database instance
 * @param clerkId - Clerk user ID
 * @returns User record or undefined
 */
export async function getUserByClerkId(db: ReturnType<typeof getDb>, clerkId: string) {
	return db.select().from(users).where(eq(users.clerkId, clerkId)).get();
}
