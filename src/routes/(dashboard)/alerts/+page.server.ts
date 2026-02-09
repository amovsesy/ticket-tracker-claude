import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { isDemoModeEnabled } from '$lib/server/demoMode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const session = locals.session;

	if (!session || !platform?.env?.DB) {
		return {
			alerts: [],
			isDemoMode: false
		};
	}

	const db = getDb(platform.env.DB);

	// Get user from database
	const user = await db.query.users.findFirst({
		where: eq(users.clerkId, session.userId)
	});

	if (!user) {
		return {
			alerts: [],
			isDemoMode: false
		};
	}

	// Check if demo mode is enabled
	const demoMode = await isDemoModeEnabled(db, user.id);

	if (demoMode) {
		// Return mock alerts for demo mode
		const mockAlerts = [
			{
				id: -1,
				type: 'price_drop' as const,
				eventName: 'Taylor Swift | The Eras Tour',
				venue: 'BC Place, Vancouver',
				section: 'Floor Section A',
				oldPrice: 450,
				newPrice: 389,
				targetPrice: 400,
				timestamp: new Date('2026-02-06T10:30:00'),
				isNew: true
			},
			{
				id: -2,
				type: 'price_drop' as const,
				eventName: 'The Weeknd - After Hours Til Dawn',
				venue: 'Rogers Arena, Vancouver',
				section: 'Lower Bowl 102',
				oldPrice: 285,
				newPrice: 249,
				targetPrice: 300,
				timestamp: new Date('2026-02-05T15:45:00'),
				isNew: false
			},
			{
				id: -3,
				type: 'target_reached' as const,
				eventName: "Drake - It's All a Blur Tour",
				venue: 'Climate Pledge Arena, Seattle',
				section: 'Upper Bowl 201',
				oldPrice: undefined,
				newPrice: 175,
				targetPrice: 200,
				timestamp: new Date('2026-02-04T09:20:00'),
				isNew: false
			}
		];

		return {
			alerts: mockAlerts,
			isDemoMode: true
		};
	}

	// TODO: Fetch real alerts from notifications table
	// For now, return empty array when not in demo mode
	const realAlerts: typeof mockAlerts = [];

	return {
		alerts: realAlerts,
		isDemoMode: false
	};
};
