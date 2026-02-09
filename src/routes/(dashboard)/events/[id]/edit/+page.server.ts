import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const eventId = parseInt(params.id);

	// Mock data - replace with actual database query
	const trackedEvent = {
		id: eventId,
		eventName: 'Taylor Swift | The Eras Tour',
		venue: 'SoFi Stadium',
		location: 'Los Angeles, CA',
		date: '2024-08-10T19:30:00',
		imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
		category: 'concerts' as const,
		targetPrice: 250.0,
		section: 'Lower Bowl',
		isPaused: false
	};

	if (!trackedEvent) {
		throw error(404, 'Tracked event not found');
	}

	return {
		event: trackedEvent
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const eventId = parseInt(params.id);
		const formData = await request.formData();

		const targetPrice = parseFloat(formData.get('targetPrice') as string);
		const section = formData.get('section') as string;
		const isPaused = formData.get('isPaused') === 'true';

		// TODO: Update database with new values
		// await db.update(trackedEvents)
		//   .set({ targetPrice, section, isPaused })
		//   .where(eq(trackedEvents.id, eventId));

		console.log('Updated tracking settings:', { eventId, targetPrice, section, isPaused });

		throw redirect(303, `/events/${eventId}`);
	},

	delete: async ({ params }) => {
		const eventId = parseInt(params.id);

		// TODO: Delete from database
		// await db.delete(trackedEvents).where(eq(trackedEvents.id, eventId));

		console.log('Deleted tracked event:', eventId);

		throw redirect(303, '/dashboard');
	}
};
