import type { PageServerLoad } from './$types';

// Mock data for tracked events
const mockTrackedEvents = [
	{
		id: 1,
		eventName: 'Taylor Swift | The Eras Tour',
		venue: 'SoFi Stadium',
		location: 'Los Angeles, CA',
		date: new Date('2024-08-08T19:00:00'),
		category: 'concerts',
		imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
		section: 'Floor A',
		targetPrice: 450.0,
		currentLowestPrice: 389.0,
		percentageChange: -13.6,
		lastChecked: new Date('2024-02-06T12:30:00'),
		priceHistory: [420, 415, 410, 405, 398, 392, 389] // Last 7 data points
	},
	{
		id: 2,
		eventName: 'Los Angeles Lakers vs Golden State Warriors',
		venue: 'Crypto.com Arena',
		location: 'Los Angeles, CA',
		date: new Date('2024-03-15T19:30:00'),
		category: 'sports',
		imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
		section: 'Lower Bowl',
		targetPrice: 200.0,
		currentLowestPrice: 245.0,
		percentageChange: 2.1,
		lastChecked: new Date('2024-02-06T12:15:00'),
		priceHistory: [260, 255, 250, 248, 242, 240, 245]
	},
	{
		id: 3,
		eventName: 'Hamilton',
		venue: 'Pantages Theatre',
		location: 'Hollywood, CA',
		date: new Date('2024-04-20T20:00:00'),
		category: 'theater',
		imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop',
		section: 'Orchestra',
		targetPrice: 150.0,
		currentLowestPrice: 142.0,
		percentageChange: -5.3,
		lastChecked: new Date('2024-02-06T11:45:00'),
		priceHistory: [155, 152, 150, 148, 145, 143, 142]
	}
];

export const load: PageServerLoad = async ({ locals }) => {
	// Get user from session
	const session = locals.session;

	if (!session) {
		// This shouldn't happen because of auth middleware, but handle gracefully
		return {
			trackedEvents: []
		};
	}

	// In a real app, we would fetch from database:
	// const db = getDb(platform.env.DB);
	// const trackedEvents = await db.select()
	//   .from(trackedEvents)
	//   .where(eq(trackedEvents.userId, userDbId))
	//   .all();

	// Return mock data for now
	return {
		trackedEvents: mockTrackedEvents,
		userName: session.claims.name || session.claims.email || 'User'
	};
};
