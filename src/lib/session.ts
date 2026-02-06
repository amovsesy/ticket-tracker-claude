import type { Cookies } from '@sveltejs/kit';

export function setSessionIdInCookies(sessionId: string, cookies: Cookies): void {
	cookies.set('x-session-id', sessionId, {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		secure: true,
		maxAge: 60 * 60 * 24 * 60 // 60 days
	});
}
