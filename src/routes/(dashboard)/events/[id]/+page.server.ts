import type { PageServerLoad } from './$types';

// Mock price history data (last 30 days)
function generatePriceHistory() {
	const now = new Date();
	const history = [];
	let basePrice = 450;

	for (let i = 30; i >= 0; i--) {
		const date = new Date(now);
		date.setDate(date.getDate() - i);

		// Add some realistic price fluctuation
		const fluctuation = (Math.random() - 0.5) * 20;
		basePrice = Math.max(350, Math.min(500, basePrice + fluctuation));

		history.push({
			date: date.toISOString(),
			price: Math.round(basePrice * 100) / 100,
			section: 'Floor A',
			platform: 'stubhub'
		});
	}

	return history;
}

// Mock recent price changes
const recentChanges = [
	{
		id: 1,
		date: new Date('2024-02-06T12:30:00').toISOString(),
		oldPrice: 392.0,
		newPrice: 389.0,
		change: -3.0,
		percentageChange: -0.77,
		section: 'Floor A',
		platform: 'stubhub'
	},
	{
		id: 2,
		date: new Date('2024-02-05T18:15:00').toISOString(),
		oldPrice: 398.0,
		newPrice: 392.0,
		change: -6.0,
		percentageChange: -1.51,
		section: 'Floor A',
		platform: 'ticketmaster'
	},
	{
		id: 3,
		date: new Date('2024-02-05T09:00:00').toISOString(),
		oldPrice: 405.0,
		newPrice: 398.0,
		change: -7.0,
		percentageChange: -1.73,
		section: 'Floor A',
		platform: 'stubhub'
	}
];

export const load: PageServerLoad = async ({ params }) => {
	const eventId = params.id;

	// In a real app, fetch from database
	// const db = getDb(platform.env.DB);
	// const event = await db.select().from(events).where(eq(events.id, eventId)).get();
	// const priceHistory = await db.select().from(priceHistory)...

	// Mock event data
	const event = {
		id: parseInt(eventId),
		name: 'Taylor Swift | The Eras Tour',
		venue: 'SoFi Stadium',
		location: 'Los Angeles, CA',
		date: new Date('2024-08-08T19:00:00').toISOString(),
		category: 'concerts',
		imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop',
		description:
			"Don't miss Taylor Swift's record-breaking Eras Tour at SoFi Stadium. Experience hits from every era in this unforgettable concert experience.",

		// Tracking info
		isTracking: true,
		targetPrice: 450.0,
		section: 'Floor A',
		isPaused: false,
		lastChecked: new Date('2024-02-06T12:30:00').toISOString(),

		// Current prices by section
		currentPrices: {
			all: 389.0,
			floor: 389.0,
			lowerBowl: 275.0,
			upperBowl: 145.0
		},

		// Price change
		percentageChange: -13.6,
		priceChange: -61.0
	};

	return {
		event,
		priceHistory: generatePriceHistory(),
		recentChanges
	};
};
