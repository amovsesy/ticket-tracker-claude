import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { isDemoModeEnabled } from '$lib/server/demoMode';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const session = locals.session;

	if (!session || !platform?.env?.DB) {
		return {
			searchResults: [],
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
			searchResults: [],
			isDemoMode: false
		};
	}

	// Check if demo mode is enabled
	const demoMode = await isDemoModeEnabled(db, user.id);

	if (demoMode) {
		// Return mock search results for demo mode
		const mockResults = [
			{
				id: -1,
				title: 'Taylor Swift | The Eras Tour',
				date: 'Dec 08',
				venue: 'BC Place, Vancouver',
				platform: 'ticketmaster',
				image:
					'https://lh3.googleusercontent.com/aida-public/AB6AXuBIAw2ws9OtCtHYh7Y1fwZNXEDTux46Sytza1qT50cY1xlH70GoGAfOZPaOYVdwShvoxVQqklNtkQ_sMrbT7ceS_XdNUeBbcnPc_ixhNdPV5NlAuoSKMgZ3gu55TbFY4gbwSrfyYE-OjaXlyjn-IMlID0y9hublnEvyeyrfu-1sagK204bSh6haELTMjmDUplS7PrGcwPzOAUcrPOCHC8oNDpPn5vBvPIMVcMGQWIcU83PstArY3Msz_65M6gyQCRn0LNmji_KBSQo'
			},
			{
				id: -2,
				title: 'The Eras Tour - Resale',
				date: 'Dec 07',
				venue: 'BC Place, Vancouver',
				platform: 'stubhub',
				image:
					'https://lh3.googleusercontent.com/aida-public/AB6AXuBSAScACo4Tutj41haMjejB-lnuh0nDB6Hq7SgJZ6dvyJ_49rQq3CUHCSqrrRMQbj1Pu-ARYb6weIgj9oQDF688Wl3rRw4VSZ8MItDqP8llMLCs2r6l9_RTBFIlqHzp_jci9MNE5Lrz0DjlMFUYd4BAYibgdtxk1zrPOB-MujQqWkUD_SxyI2QBXOw9O_bWweoMs8WL7-O95qutSNocTD8DAJT2OJYEXk04lF2BLYqqQV7EiY1UsdrYc58aKnn4d9QwHlfFNmGQBiE'
			}
		];

		return {
			searchResults: mockResults,
			isDemoMode: true
		};
	}

	// TODO: Implement real search functionality
	// For now, return empty array when not in demo mode
	const realResults: typeof mockResults = [];

	return {
		searchResults: realResults,
		isDemoMode: false
	};
};
