/**
 * Mock data generator for demo mode
 * Generates fake events, prices, and notifications for testing
 */

export interface MockEvent {
	id: number; // Negative IDs indicate mock data
	name: string;
	venue: string;
	location: string;
	date: Date;
	category: 'sports' | 'concerts' | 'theater' | 'other';
	imageUrl: string;
	currentPrice: number;
	targetPrice: number;
	section: string;
	percentageChange: number;
	priceHistory: number[];
	isPaused: boolean;
	lastChecked: Date;
}

export interface MockNotification {
	id: number; // Negative IDs indicate mock data
	type: 'email' | 'sms';
	recipient: string;
	subject?: string;
	message: string;
	sentAt: Date;
	wasSuccessful: boolean;
	eventName: string;
}

/**
 * Generate mock tracked events for demo mode
 */
export function generateMockEvents(count: number = 5): MockEvent[] {
	const mockEvents: MockEvent[] = [
		{
			id: -1,
			name: 'Taylor Swift | The Eras Tour',
			venue: 'SoFi Stadium',
			location: 'Los Angeles, CA',
			date: new Date('2024-08-10T19:30:00'),
			category: 'concerts',
			imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
			currentPrice: 389,
			targetPrice: 400,
			section: 'Floor Section A',
			percentageChange: -15.2,
			priceHistory: [450, 445, 420, 410, 405, 395, 389],
			isPaused: false,
			lastChecked: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
		},
		{
			id: -2,
			name: 'Lakers vs Warriors',
			venue: 'Crypto.com Arena',
			location: 'Los Angeles, CA',
			date: new Date('2024-08-15T19:00:00'),
			category: 'sports',
			imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&h=600&fit=crop',
			currentPrice: 285,
			targetPrice: 250,
			section: 'Lower Bowl 101',
			percentageChange: -8.3,
			priceHistory: [310, 305, 298, 290, 288, 285, 285],
			isPaused: false,
			lastChecked: new Date(Date.now() - 1000 * 60 * 2) // 2 minutes ago
		},
		{
			id: -3,
			name: 'Hamilton',
			venue: 'Pantages Theatre',
			location: 'Hollywood, CA',
			date: new Date('2024-08-20T20:00:00'),
			category: 'theater',
			imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
			currentPrice: 145,
			targetPrice: 150,
			section: 'Orchestra Center',
			percentageChange: -4.5,
			priceHistory: [152, 150, 148, 147, 146, 145, 145],
			isPaused: false,
			lastChecked: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
		},
		{
			id: -4,
			name: 'Coachella 2024 - Weekend 1',
			venue: 'Empire Polo Club',
			location: 'Indio, CA',
			date: new Date('2024-04-12T12:00:00'),
			category: 'concerts',
			imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
			currentPrice: 575,
			targetPrice: 500,
			section: 'GA Weekend Pass',
			percentageChange: 2.1,
			priceHistory: [550, 555, 560, 565, 570, 572, 575],
			isPaused: true,
			lastChecked: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
		},
		{
			id: -5,
			name: 'UFC 300',
			venue: 'T-Mobile Arena',
			location: 'Las Vegas, NV',
			date: new Date('2024-04-13T22:00:00'),
			category: 'sports',
			imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
			currentPrice: 425,
			targetPrice: 400,
			section: 'Lower Level 12',
			percentageChange: -12.8,
			priceHistory: [488, 475, 465, 450, 440, 430, 425],
			isPaused: false,
			lastChecked: new Date(Date.now() - 1000 * 60 * 3) // 3 minutes ago
		}
	];

	return mockEvents.slice(0, count);
}

/**
 * Generate mock notification history for demo mode
 */
export function generateMockNotifications(count: number = 10): MockNotification[] {
	const mockNotifications: MockNotification[] = [
		{
			id: -1,
			type: 'email',
			recipient: 'user@example.com',
			subject: 'Price Drop Alert: Taylor Swift | The Eras Tour',
			message: 'The price for Taylor Swift | The Eras Tour has dropped to $389 (was $395).',
			sentAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
			wasSuccessful: true,
			eventName: 'Taylor Swift | The Eras Tour'
		},
		{
			id: -2,
			type: 'sms',
			recipient: '+1 (555) 123-4567',
			message:
				'Price Alert: Lakers vs Warriors is now $285 (15% off target). View details: https://...',
			sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
			wasSuccessful: true,
			eventName: 'Lakers vs Warriors'
		},
		{
			id: -3,
			type: 'email',
			recipient: 'user@example.com',
			subject: 'Price Drop Alert: Hamilton',
			message: 'The price for Hamilton has dropped to $145 (was $147).',
			sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
			wasSuccessful: true,
			eventName: 'Hamilton'
		},
		{
			id: -4,
			type: 'email',
			recipient: 'user@example.com',
			subject: 'Price Drop Alert: UFC 300',
			message: 'The price for UFC 300 has dropped to $425 (was $430).',
			sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
			wasSuccessful: true,
			eventName: 'UFC 300'
		},
		{
			id: -5,
			type: 'sms',
			recipient: '+1 (555) 123-4567',
			message:
				'Price Alert: Taylor Swift | The Eras Tour is now $395 (12% off target). View: https://...',
			sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
			wasSuccessful: false,
			eventName: 'Taylor Swift | The Eras Tour'
		}
	];

	return mockNotifications.slice(0, count);
}
