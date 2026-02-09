import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const eventId = url.searchParams.get('event');

	if (!eventId) {
		// If no event ID provided, redirect to dashboard
		throw redirect(302, '/dashboard');
	}

	// Redirect to event details page
	throw redirect(302, `/events/${eventId}`);
};
