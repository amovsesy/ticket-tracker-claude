import { getDb } from './db';
import { userDemoMode } from './db/schema';
import { eq } from 'drizzle-orm';

/**
 * Check if demo mode is enabled for a user
 * @param db Database instance
 * @param userId User ID to check
 * @returns true if demo mode is enabled, false otherwise
 */
export async function isDemoModeEnabled(
	db: ReturnType<typeof getDb>,
	userId: number
): Promise<boolean> {
	const demoMode = await db.query.userDemoMode.findFirst({
		where: eq(userDemoMode.userId, userId)
	});
	return demoMode?.isEnabled || false;
}

/**
 * Toggle demo mode for a user
 * @param db Database instance
 * @param userId User ID to toggle demo mode for
 * @param adminUserId Admin user ID who is performing the action
 * @param enabled Whether to enable or disable demo mode
 */
export async function toggleDemoMode(
	db: ReturnType<typeof getDb>,
	userId: number,
	adminUserId: number,
	enabled: boolean
): Promise<void> {
	const existing = await db.query.userDemoMode.findFirst({
		where: eq(userDemoMode.userId, userId)
	});

	if (existing) {
		// Update existing record
		await db
			.update(userDemoMode)
			.set({
				isEnabled: enabled,
				enabledBy: adminUserId,
				enabledAt: new Date()
			})
			.where(eq(userDemoMode.userId, userId));
	} else {
		// Insert new record
		await db.insert(userDemoMode).values({
			userId,
			isEnabled: enabled,
			enabledBy: adminUserId,
			enabledAt: new Date()
		});
	}
}
