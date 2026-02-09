import { requireAdmin } from '$lib/server/adminAuth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const admin = await requireAdmin(event);

	return {
		admin: {
			id: admin.id,
			email: admin.email,
			name: admin.email.split('@')[0],
			isAdmin: admin.isAdmin
		}
	};
};
